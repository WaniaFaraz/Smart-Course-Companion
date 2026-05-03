// INSTRUCTOR COURSE PAGE SCRIPTS

let courseId;
let instructorId;
document.addEventListener('DOMContentLoaded', getSession); //do getSession when the document loads

// GET SESSION INFO AND LOAD PAGE
async function getSession() {
    const response = await fetch('/api/instructor/session');
    const session = await response.json();
    const params = new URLSearchParams(window.location.search);
    courseId = params.get('courseId');

    if (!courseId) {
        console.log('No courseId in URL');
        return;
    }

    if (!session.loggedIn) {
        window.location.href = '/instructor/sign-in';
        return;
    }

    instructorId = session.userId;
    await loadAssignments();
    await loadCourseName();
    await loadCompletionStats();
    loadCalendar();
    // Set preview link with courseId
    document.querySelector('a[href="course-template-preview"]').href = `course-template-preview?courseId=${courseId}`;
    document.querySelector('a[href="course-templates"]').href = `course-templates?courseId=${courseId}`;
    // Display instructor info
    const response2 = await fetch(`/api/instructor/get-instructors/${instructorId}`);
    const instructor = await response2.json();
    if (instructor && instructor[0]) {
        const initials = instructor[0].firstName[0] + '.' + instructor[0].lastName[0];
        document.getElementById('username').textContent = initials;
        document.querySelector('.instructor-id').textContent = instructorId;
    }
    loadClassPerformance();
}

// LOAD COURSE NAME
async function loadCourseName() {
    const response = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
    const courses = await response.json();
    const course = courses[0]; // 
    document.querySelector('.center-title').textContent = course.code + " - " + course.section;
    document.querySelector('.current-course-count').textContent = course.title;
}

// LOAD ASSIGNMENTS OF THE COURSE
async function loadAssignments() {
    const response = await fetch(`/api/instructor/get-assignments/${courseId}`);
    const assignments = await response.json();
    displayAssignments(assignments);
}

// LOAD CLASS PERFORMANCE FOR THIS COURSE
async function loadClassPerformance() {
    const response = await fetch(`/api/instructor/get-course-average/${courseId}`);
    const data = await response.json();
    const avg = data.average || 0;

    const container = document.querySelector('.classes-performance-bars-container');
    container.innerHTML = `
        <div class="courseRow">
            <div class="courseLabel">
                <span>Course Average</span>
                <span>${avg}%</span>
            </div>
            <div class="barBackground">
                <div class="barFill" style="width: ${avg}%"></div>
            </div>
        </div>
    `;
    document.getElementById('overall-percent').textContent = avg + '%';
}

// DISPLAY ASSIGNMENTS IN THE TABLE
function displayAssignments(assignments) {
    const tbody = document.querySelector('.assessments-table tbody');
    tbody.innerHTML = '';

    assignments.forEach(assignment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assignment.title}</td>
            <td>${assignment.description}</td>
            <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
            <td>${assignment.weight}%</td>
        `;
        tbody.appendChild(row);
    });
}

//ADD ASSIGNMENT
/*
const addAssessmentButton = document.getElementById("add-assessment-button");
addAssessmentButton.addEventListener("click", createAssessment);
async function createAssessment() {
    //const
}
    */
// LOAD ASSESSMENT COMPLETION STATS
async function loadCompletionStats() {
    const response = await fetch(`/api/instructor/get-completion-stats/${courseId}`);
    const stats = await response.json();
    displayCompletionStats(stats);
}

// DISPLAY COMPLETION STATS AS PROGRESS BARS
function displayCompletionStats(stats) {
    const container = document.querySelector('.completion-card');
    container.innerHTML = '';

    if (stats.length === 0) {
        container.innerHTML = '<p>No data available</p>';
        return;
    }

    stats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'completion-item';
        item.innerHTML = `
            <span class="completion-label">${stat.title}</span>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${stat.completionPercent}%"></div>
            </div>
            <span class="completion-percent">${stat.completionPercent}%</span>
        `;
        container.appendChild(item);
    });
}

// EDIT ASSESSMENT MODAL
document.getElementById('open-edit-modal').addEventListener('click', (e) => {
    e.preventDefault();
    loadAssignmentsInDropdown();
    document.getElementById('edit-assessment-modal').showModal();
});

document.getElementById('close-edit-modal-btn').addEventListener('click', () => {
    document.getElementById('edit-assessment-modal').close();
});

// Load assignments in the dropdown
async function loadAssignmentsInDropdown() {
    const response = await fetch(`/api/instructor/get-assignments/${courseId}`);
    const assignments = await response.json();
    const select = document.getElementById('edit-select-assignment');
    select.innerHTML = '<option value="">Select an assignment...</option>';
    assignments.forEach(a => {
        select.innerHTML += `<option value="${a.assignmentId}">${a.title}</option>`;
    });
}

// When an assignment is selected, fill the form
document.getElementById('edit-select-assignment').addEventListener('change', async (e) => {
    const assignmentId = e.target.value;
    if (!assignmentId) return;
    const response = await fetch(`/api/instructor/get-assignments/${courseId}`);
    const assignments = await response.json();
    const assignment = assignments.find(a => a.assignmentId == assignmentId);
    document.getElementById('edit-title').value = assignment.title;
    document.getElementById('edit-description').value = assignment.description;
    document.getElementById('edit-weight').value = assignment.weight;
    document.getElementById('edit-duedate').value = assignment.dueDate.split('T')[0];
});

// Save the edited assignment
document.getElementById('save-edit-btn').addEventListener('click', async () => {
    const assignmentId = document.getElementById('edit-select-assignment').value;
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const weight = document.getElementById('edit-weight').value;
    const dueDate = document.getElementById('edit-duedate').value;

    await fetch(`/api/instructor/update-assignment/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, weight, dueDate })
    });

    document.getElementById('edit-assessment-modal').close();
    loadAssignments(); // reload table
});

// CREATE ASSIGNMENT MODAL
document.getElementById('open-create-modal').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('create-assignment-modal').showModal();
});

document.getElementById('close-create-modal-btn').addEventListener('click', () => {
    document.getElementById('create-assignment-modal').close();
});

// Save new assignment to database
document.getElementById('save-create-btn').addEventListener('click', async () => {
    const title = document.getElementById('create-title').value;
    const description = document.getElementById('create-description').value;
    const weight = document.getElementById('create-weight').value;
    const dueDate = document.getElementById('create-duedate').value;

    await fetch('/api/instructor/create-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, courseId, title, description, weight, dueDate })
    });

    document.getElementById('create-assignment-modal').close();
    loadAssignments();
    loadCompletionStats();
});

// EDIT TEMPLATE - redirect to template page with courseId
document.getElementById('open-edit-template').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `course-templates?courseId=${courseId}`;
});

//LOAD THE CALENDAR ON THE RIGHT
async function loadCalendar() {
    let row;
    console.log("calendar reached");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date();
    const today = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth();
    const calMonthYear = document.getElementById("cal-month-year");
    calMonthYear.innerHTML = months[month] + " " + year;

    const firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDay = firstDayDate.getDay() - 1; //day of the week of the first day of the month
    console.log("firstDay:", firstDay);

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    console.log(daysInMonth);
    //populate the first week:
    let dayNumber = 1;
    for (let col = firstDay; col <= 7; col++) {
        console.log("dayNumber:", dayNumber);
        let calDay = document.getElementById(`1-${col}`);
        calDay.innerHTML = dayNumber;
        calDay.classList.add("show");
        dayNumber++;
    }
    //find the remaining number of weeks
    const numWeeks = Math.floor(daysInMonth / 7);
    console.log("numWeeks:", numWeeks);
    for (let count = 1; count < numWeeks; count++) {
        for (let col = 1; col <= 7; col++) {
            row = 1 + count;
            console.log("dayNumber:", dayNumber);
            console.log("row-col:", `${row}-${col}`);
            let calDay = document.getElementById(`${row}-${col}`);
            calDay.innerHTML = dayNumber;
            calDay.classList.add("show");
            dayNumber++;
        }

    }
    //find the remaining number of days
    const remainingDays = daysInMonth - dayNumber + 1;
    row++;
    console.log("remaining days:", remainingDays);
    for (let col = 1; col <= remainingDays; col++) {
        console.log("dayNumber:", dayNumber);
        console.log("row-col:", `${row}-${col}`);
        let calDay = document.getElementById(`${row}-${col}`);
        calDay.innerHTML = dayNumber;
        calDay.classList.add("show");
        dayNumber++;

    }


}


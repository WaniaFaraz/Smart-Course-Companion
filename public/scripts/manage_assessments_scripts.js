// WIAME: MANAGE ASSESSMENTS PAGE SCRIPTS

let allAssignments = []; //stores assignments for filtering
let studentId;

//GET the student ID of the logged in student
async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();
    if (!session.loggedIn) {
        window.location.href = '/student/sign-in';
        return;
    }
    studentId = session.userId;
    // Display student info
    document.getElementById('username').textContent = session.firstName;
    document.querySelector('.student-id').textContent = session.userId;
    loadAssignments();
    
}

//Load all the concerned student's assignments from the database
async function loadAssignments() {
    const response = await fetch(`/api/student/get-assignments/${studentId}`);
    allAssignments = await response.json();
    displayAssignments(allAssignments);
    updateCounters(allAssignments);
}

//Display assignments on the page
function displayAssignments(assignments) {
    const section = document.querySelector('.assessments');
    section.innerHTML = '';

    assignments.forEach(assignment => {
        const card = document.createElement('div');
        card.className = 'assessment-card';
        card.innerHTML = `
            <input type="checkbox" id="ass${assignment.assignmentId}" 
                class="status" ${assignment.completed ? 'checked' : ''}>
            <label for="ass${assignment.assignmentId}">${assignment.title}</label>
            <div class="assessment-details">
                <h3>${assignment.title}</h3>
                <p>${assignment.code} ${assignment.section}</p>
            </div>
            <button class="delete-assessment">Delete</button>
        `;

        const checkbox = card.querySelector('.status');
        checkbox.addEventListener('change', () => {
            updateCompleted(assignment.assignmentId, checkbox.checked);
        });

        const deleteBtn = card.querySelector('.delete-assessment');
        deleteBtn.addEventListener('click', () => {
            deleteAssignment(assignment.assignmentId);
        });

        section.appendChild(card);
    });
}

//Update completed status in the database
async function updateCompleted(assignmentId, completed) {
    await fetch('/api/student/update-completed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, assignmentId, completed })
    });
    loadAssignments();
}

//Update the counters at the top
function updateCounters(assignments) {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const pending = total - completed;

    const cards = document.querySelectorAll('.summary .card h2');
    cards[0].textContent = total;
    cards[1].textContent = completed;
    cards[2].textContent = pending;
}

//Delete an assignment
async function deleteAssignment(assignmentId) {
    await fetch('/api/student/delete-assignment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, assignmentId })
    });
    loadAssignments();
}

//Filter by status (all/pending/completed)
function filterByStatus(status) {
    if (status === 'all') {
        displayAssignments(allAssignments);
    } else if (status === 'completed') {
        displayAssignments(allAssignments.filter(a => a.completed));
    } else if (status === 'pending') {
        displayAssignments(allAssignments.filter(a => !a.completed));
    }
}

//Filter by course code
function filterByCourse(courseCode) {
    if (courseCode === 'all') {
        displayAssignments(allAssignments);
    } else {
        displayAssignments(allAssignments.filter(a => a.code === courseCode));
    }
}

//Connect filter buttons
document.querySelectorAll('.status-filter .filter').forEach(btn => {
    btn.addEventListener('click', () => {
        filterByStatus(btn.textContent.trim().toLowerCase());
    });
});

document.querySelectorAll('.course-filter .filter').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        filterByCourse(text === 'All Courses' ? 'all' : text);
    });
});

getSession();
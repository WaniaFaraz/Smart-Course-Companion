// STUDENT COURSE PAGE SCRIPTS

let studentId;
let courseId;

// GET SESSION INFO
async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();

    const params = new URLSearchParams(window.location.search);
    courseId = params.get('courseId');

    if (!courseId) {
        console.log('No courseId in URL');
        return;
    }

    if (!session.loggedIn) {
        window.location.href = '/student/sign-in';
        return;
    }

    studentId = session.userId;
    // Display student info
    document.getElementById('username').textContent = session.firstName;
    document.querySelector('.student-id').textContent = session.userId;
    loadAssignments();
    loadCourseName();
    loadCalendar();
    // Set course structure link with courseId
    const structureBtn = document.querySelector('a[href="course-templates"]');
    if (structureBtn) structureBtn.href = `course-templates?courseId=${courseId}`;
}


// LOAD ASSIGNMENTS OF THE STUDENT FOR THIS COURSE
async function loadAssignments() {
    const response = await fetch(`/api/student/get-assignments-by-course/${courseId}`);
    const assignments = await response.json();
    displayAssignments(assignments);
    loadEnterMarks(assignments);
    loadGradeBreakdown(assignments);
    loadTasks(); 
}

//LOAD THE CALENDAR ON THE RIGHT
async function loadCalendar() {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date();
    const today = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth();
    const calMonthYear = document.getElementById("cal-month-year")
    calMonthYear.innerHTML = months[month] + " " + year;
    //April 4 2026  Saturday(6) --> 4/7 = 0 --> week 1 saturday --> 1-6 == 4
    //Saturdays: 11, 18, 25, 32
    //1,8,15,22,29 ... 7n+1 --> (num-1)/7 == 0 --> first day of the month
    //row = week
    //colum = day of the week
    //find week#
    const dayOfTheMonth = date.getDate();
    
}

// DISPLAY ASSIGNMENTS IN THE TABLE
function displayAssignments(assignments) {
    const tbody = document.querySelector('.assess-table tbody');
    tbody.innerHTML = '';

    assignments.forEach(assignment => {
        const status = assignment.completed ? 'Submitted' : 'Pending';
        const statusClass = assignment.completed ? 'submitted' : 'not-started';
        const grade = assignment.grade ? assignment.grade + '%' : '-';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assignment.title}</td>
            <td>${assignment.description}</td>
            <td>${new Date(assignment.dueDate).toLocaleDateString()}</td>
            <td><span class="status ${statusClass}">${status}</span></td>
            <td>${grade}</td>
        `;
        tbody.appendChild(row);
    });
}

// LOAD COURSE NAME
async function loadCourseName() {
    const response = await fetch(`/api/student/get-course-from-courseId/${courseId}`);
    const courses = await response.json();
    const course = courses[0];
    document.querySelector('.course-title h2').textContent = course.code;
    document.querySelector('.course-title p').textContent = course.title;
}

// LOAD ENTER MARKS TABLE
function loadEnterMarks(assignments) {
    const tbody = document.querySelectorAll('.assess-table tbody')[1];
    tbody.innerHTML = '';

    assignments.forEach(assignment => {
        const grade = assignment.grade || 0;
        const total = 100;
        const percent = Math.round((grade / total) * 100);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${assignment.title}</td>
            <td><input type="number" class="mark-input" value="${grade}" 
                onchange="saveGrade(${assignment.assignmentId}, this.value)"></td>
            <td>${total}</td>
            <td class="percent-cell">${percent}%</td>
        `;
        tbody.appendChild(row);
    });
}

// SAVE GRADE TO DATABASE
async function saveGrade(assignmentId, grade) {
    await fetch('/api/student/update-grade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, grade })
    });
}

// LOAD GRADE BREAKDOWN 
function loadGradeBreakdown(assignments) {
    const completed = assignments.filter(a => a.completed && a.grade !== null);

    const avg = completed.length > 0
        ? Math.round(completed.reduce((sum, a) => sum + a.grade, 0) / completed.length)
        : 0;

    const circle = document.querySelector('.donut-chart');
    circle.style.background = `conic-gradient(#ffb948 ${avg}%, #e0e0e0 ${avg}%)`;
    document.querySelector('.donut-percent').textContent = avg + '%';
}

// LOAD TASKS
async function loadTasks() {
    const response = await fetch(`/api/student/get-tasks/${courseId}`);
    const tasks = await response.json();
    displayTasks(tasks);
}

// DISPLAY TASKS
function displayTasks(tasks) {
    const taskList = document.querySelector('.tasks');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li>No tasks yet!</li>';
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                onchange="updateTask(${task.taskId}, this.checked)">
            ${task.description}
            <button onclick="removeTask(${task.taskId})" style="float:right; background:none; border:none; cursor:pointer; color:red;">✕</button>
        `;
        taskList.appendChild(li);
    });
}

// ADD A TASK
async function addNewTask() {
    const input = document.getElementById('new-task-input');
    const description = input.value.trim();
    if (!description) return;

    await fetch('/api/student/add-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, description })
    });

    input.value = '';
    loadTasks();
}

// UPDATE TASK STATUS
async function updateTask(taskId, completed) {
    await fetch(`/api/student/update-task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    loadTasks();
}

// DELETE A TASK
async function removeTask(taskId) {
    await fetch(`/api/student/delete-task/${taskId}`, {
        method: 'DELETE'
    });
    loadTasks();
}

document.getElementById('addTaskBtn').addEventListener('click', () => {
    const form = document.getElementById('new-task-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

getSession();
// WIAME: MANAGE ASSESSMENTS PAGE SCRIPTS

let allAssignments = []; //stores assignments for filtering
let studentId;

//GET the student ID of the logged in student
async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();
    if (!session.loggedIn) {
        window.location.href = '/student/sign-in'; // redirect if not logged in
        return;
    }
    studentId = session.userId;
    loadAssignments();
}

//Load all the concerned student's assignments from the database
async function loadAssignments() {
    const response = await fetch(`/api/student/get-assignments/${studentId}`);
    allAssignments = await response.json();
    displayAssignments(allAssignments);
    updateCounters(allAssignments);
}

function displayAssignments(assignments) {
    const section = document.querySelector('.assessments');
    section.innerHTML = ''; // clear hard-coded cards from the frontend submission

    assignments.forEach(assignment => {
        const card = document.createElement('div');
        card.className = 'assessment-card';
        card.innerHTML = `
            <input type="checkbox" id="ass${assignment.assignmentId}" 
                class="status" ${assignment.completed ? 'checked' : ''}>
            <label for="ass${assignment.assignmentId}">${assignment.title}</label>
            <div class="assessment-details">
                <h3>${assignment.title}</h3>
                <p>Course ID: ${assignment.courseId}</p>
            </div>
            <button class="delete-assessment">Delete</button>
        `;

        // Checkbox to mark as completed/pending when clicked/unclicked
        const checkbox = card.querySelector('.status');
        checkbox.addEventListener('change', () => {
            updateCompleted(assignment.assignmentId, checkbox.checked);
        });

        // Delete button to remove assignment from database
        const deleteBtn = card.querySelector('.delete-assessment');
        deleteBtn.addEventListener('click', () => {
            deleteAssignment(assignment.assignmentId);
        });

        section.appendChild(card);
    });
}

//Update the completed status in the database
async function updateCompleted(assignmentId, completed) {
    await fetch('/api/student/update-completed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, assignmentId, completed })
    });
    loadAssignments(); // reload to update counters
}

//Update the counters of the status at the top of the html page (total/completed/pending)
function updateCounters(assignments) {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const pending = total - completed;

    const cards = document.querySelectorAll('.summary .card h2');
    cards[0].textContent = total;
    cards[1].textContent = completed;
    cards[2].textContent = pending;
}

// Delete an assignment
async function deleteAssignment(assignmentId) {
    await fetch('/api/student/delete-assignment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, assignmentId })
    });
    loadAssignments(); // reload page after delete
}

getSession();

// INSTRUCTOR TEMPLATES PAGE SCRIPTS

let instructorId;
let courseId;

// GET SESSION INFO
async function getSession() {
    const response = await fetch('/api/instructor/session');
    const session = await response.json();

    if (!session.loggedIn) {
        window.location.href = '/instructor/sign-in';
        return;
    }

    instructorId = session.userId;
    const params = new URLSearchParams(window.location.search);
    courseId = params.get('courseId');

    if (courseId) loadExistingTemplate();

    // Display instructor info
    const response2 = await fetch(`/api/instructor/get-instructors/${instructorId}`);
    const instructor = await response2.json();
    if (instructor && instructor[0]) {
        const firstName = instructor[0].firstName;
        const lastName = instructor[0].lastName;
        const initials = firstName[0] + '.' + lastName[0];
        document.querySelector('.center-title').textContent = `WELCOME PROFESSOR ${lastName.toUpperCase()}`;
        const courseResponse = await fetch(`/api/instructor/get-courses/${instructorId}`);
        const courses = await courseResponse.json();
        document.querySelector('.current-course-count').textContent = `YOU'RE CURRENTLY MANAGING ${courses.length} COURSES`;
        document.getElementById('username').textContent = initials;
        document.querySelector('.instructor-id').textContent = instructorId;
    }
}

// LOAD EXISTING TEMPLATE IF ONE EXISTS
async function loadExistingTemplate() {
    const response = await fetch(`/api/instructor/get-template/${courseId}`);
    const template = await response.json();

    if (!template || !template.templateId) return;

    document.getElementById('course-description').value = template.description || '';
    document.getElementById('textbook').value = template.textbook || '';
    document.getElementById('week1_2').value = template.week1_2 || '';
    document.getElementById('week3_4').value = template.week3_4 || '';
    document.getElementById('week5_6').value = template.week5_6 || '';
    document.getElementById('week7_8').value = template.week7_8 || '';
    document.getElementById('week9_10').value = template.week9_10 || '';
    document.getElementById('week11_12').value = template.week11_12 || '';

    const courseResponse = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
    const courses = await courseResponse.json();
    const course = courses[0];

    document.getElementById('course-name').value = course.title || '';
    document.getElementById('course-code').value = course.code || '';
    document.getElementById('course-section').value = course.section || '';

    const evalResponse = await fetch(`/api/instructor/get-assignments/${courseId}`);
    const assignments = await evalResponse.json();
    const rows = document.querySelectorAll('.evalTable tr');

    assignments.forEach((assignment, i) => {
        if (rows[i + 1]) {
            rows[i + 1].cells[1].querySelector('input').value = assignment.title || '';
            rows[i + 1].cells[2].querySelector('input').value = assignment.weight || '';
            rows[i + 1].cells[3].querySelector('input').value = assignment.dueDate ? assignment.dueDate.split('T')[0] : '';
        }
    });
}

// PUBLISH TEMPLATE
document.getElementById('publish-btn').addEventListener('click', async () => {
    const description = document.getElementById('course-description').value;
    const textbook = document.getElementById('textbook').value;
    const week1_2 = document.getElementById('week1_2').value;
    const week3_4 = document.getElementById('week3_4').value;
    const week5_6 = document.getElementById('week5_6').value;
    const week7_8 = document.getElementById('week7_8').value;
    const week9_10 = document.getElementById('week9_10').value;
    const week11_12 = document.getElementById('week11_12').value;

    const response = await fetch('/api/instructor/save-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12 })
    });

    const result = await response.json();
    if (result.success) {
        alert('Template published successfully!');
        window.location.href = `course-page?courseId=${courseId}`;
    }
});

getSession();
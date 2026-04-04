// STUDENT TEMPLATES PAGE SCRIPTS

let courseId;

async function getSession() {
    let response = await fetch('/api/student/session');
    let session = await response.json();

    if (!session.loggedIn) {
        response = await fetch('/api/instructor/session');
        session = await response.json();
        if (!session.loggedIn) {
            window.location.href = '/student/sign-in';
            return;
        }
    }

    const params = new URLSearchParams(window.location.search);
    courseId = params.get('courseId');

    if (courseId) loadTemplate();
}

async function loadTemplate() {
    // Load template info
    const response = await fetch(`/api/instructor/get-template/${courseId}`);
    const template = await response.json();

    if (!template || !template.templateId) {
        document.querySelector('.card').innerHTML = '<p>No template published yet by your instructor.</p>';
        return;
    }

    // Load course info
    const courseResponse = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
    const courses = await courseResponse.json();
    const course = courses[0];

    document.getElementById('course-name').textContent = course.title;
    document.getElementById('course-meta').textContent = `${course.code} - Section ${course.section}`;
    document.getElementById('course-desc').textContent = template.description || '';
    document.getElementById('week1_2').textContent = template.week1_2 || '';
    document.getElementById('week3_4').textContent = template.week3_4 || '';
    document.getElementById('week5_6').textContent = template.week5_6 || '';
    document.getElementById('week7_8').textContent = template.week7_8 || '';
    document.getElementById('week9_10').textContent = template.week9_10 || '';
    document.getElementById('week11_12').textContent = template.week11_12 || '';
    document.getElementById('textbook').textContent = template.textbook || '';

    // Load evaluations from assignments table
    const evalResponse = await fetch(`/api/instructor/get-assignments/${courseId}`);
    const assignments = await evalResponse.json();
    const tbody = document.getElementById('eval-tbody');
    tbody.innerHTML = '';
    assignments.forEach(a => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Assignment</td>
            <td>${a.title}</td>
            <td>${a.weight}%</td>
            <td>${new Date(a.dueDate).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

getSession();
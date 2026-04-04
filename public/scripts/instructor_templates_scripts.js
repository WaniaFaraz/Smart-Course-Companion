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
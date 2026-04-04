const PORT = 8080;
console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession); //do getSession when the document loads
let userId;

let studentFinalCoursesArray; //array of student courses


async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();
    userId = session.userId;
    // Display student info
    document.getElementById('username').textContent = session.firstName;
    document.querySelector('.student-id').textContent = session.userId;
    await loadHomePage();
   
}

async function loadHomePage() {
    await loadCourses(); //retrieve and display all courses from the stur=dents ID
    //ADD AVERAGES CALCULATION

}

async function loadCourses() {
    //GET ALL COURSES FOR STUDENT AND ADD THEM TO THE MAIN COURSE PAGE
    //TO BE FIXED: ADD COURSE BACKGROUND - FIX DATABASE
    studentFinalCoursesArray = [];
    const response = await fetch(`/api/student/get-courses/${userId}`);
    const coursesOfStudent = await response.json(); //array of student courses from `student_courses`
    //iterate over each course
    await Promise.all(coursesOfStudent.map(async (value, index, array) => {
        //FIX THIS - DATABASE HAS BEEN UPDATED - USE COURSE ID TO GET COURSES!!!!!!!!
        const courseId = value.courseId;
        const url = `/api/student/get-course-from-courseId/${courseId}`;
        const response = await fetch(url);
        const [course] = await response.json(); //course from courses table
        const code = course.code;
        const section = course.section;
        const title = course.title;
        studentFinalCoursesArray.push(course);
        //insert data into html elements
        await createCourse(code, section, title, index, courseId);
    }))
}


//right now the function contains index - change to course backgroung image number
async function createCourse(code, section, title, index, courseId) {
    const courseArea = await document.getElementById("course-area");
    courseArea.innerHTML += `<div class="course">
                                <div class="course-image course-img-${index + 1}"></div>
                                <a class="course-info-text" href="course-page?courseId=${courseId}">
                                    <p class="course-code">${code}</p>
                                    <p class="course-name">${title}</p>
                                    <p class="course-section">Section ${section}</p>
                                </a>
                            </div>`;
}


const PORT = 8080;
console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession); //do loadHomePage when the document loads
let userId;

async function getSession() {
    const response = await fetch('/api/student/user-data');
    const session = await response.json();
    if (!session.loggedIn) {
        window.location.href = '/student/sign-in'; // redirect if not logged in
        return;
    }
    userId = session.userId;
    await loadHomePage();
}

async function loadHomePage() {
    await loadCourses(); //retrieve and display all courses from the stur=dents ID
    //ADD AVERAGES CALCULATION

}

async function loadCourses() {
    //GET ALL COURSES FOR STUDENT AND ADD THEM TO THE MAIN COURSE PAGE
    //TO BE FIXED: ADD COURSE BACKGROUND AND ADD COURSE TITLE - FIX DATABASE
    //TO BE FIXED:  RETRIEVE STUDENT ID AND THEN GENERATE1000
    const response = await fetch(`/api/student/get-courses/${userId}`);
    const coursesOfStudent = await response.json(); //array of student courses
    
    //iterate over each course
    await coursesOfStudent.forEach( async (value, index, array) => {
        console.log(value);
        const courseCode = value.courseCode;
        const courseSection = value.courseSection;
        //find title of each course
        const codeWithoutSpaces = courseCode.slice(0,4) + courseCode.slice(5); //remove spaces from course code
        const url = `http://localhost:${PORT}/api/student/get-course-from-code/` + codeWithoutSpaces; //fix url
        const response = await fetch(url);
        const course = await response.json(); //course from courses table
        const title = course.title;
        //insert data into html elements
        const courseArea = document.getElementById("course-area");
        courseArea.innerHTML += `<div class="course">
                                    <div class="course-image course-img-${index+1}"></div>
                                    <a class="course-info-text" href="course-page">
                                        <p class="course-code">${courseCode}</p>
                                        <p class="course-name">${title}</p>
                                        <p class="course-section">Section ${courseSection}</p>
                                    </a>
                                </div>`;
    })
}
    

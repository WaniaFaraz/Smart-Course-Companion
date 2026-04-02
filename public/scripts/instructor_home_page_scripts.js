console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession);
console.log("reached scripts");



let userId;
let response; //for whenever fetch is used

//get instructorId
async function getSession() {
    response = await fetch("/api/instructor/session");
    const session = await response.json();
    if(!session) {
        response = await fetch("/instructor/sign-in");
    }
    userId = session.userId;
    await loadHomePage();
}

//load the home page with the courses of the instructor
async function loadHomePage() {
    const instructorId = userId;
    response = await fetch(`/api/instructor/get-courses/${instructorId}`); 
    instructor_courses = await response.json(); //JSON: instructorId and courseId
    await instructor_courses.forEach( async (value, index, array) => {
        //get courses from courseIds
        const courseId = value.courseId;
        response = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
        const [course] = await response.json();
        //get course info from JSON object
        const title = course.title;
        const code = course.code;
        const section = course.section;
<<<<<<< Updated upstream
        await addCourseToHomePage(code, title, section, courseId);
    })
}
    


//funtion to add course to home page
async function addCourseToHomePage(code, title, section, courseId) {
    const courseArea = document.getElementById("course-area");
    courseArea.innerHTML += `<div class="course">
                                <div class="course-image course-img-1"></div>
<<<<<<< Updated upstream
                                <a class="course-info-text" href="course-page?courseId=${courseId}">
                                    <p class="course-code">${code}</p>
                                    <p class="course-name">${title}</p>
                                    <p class="course-section">Section ${section}</p>
                                </a>
                                <div class="course-toggle-row">
                                    <span>Course visible to students</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" checked />
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>`
}


//MODAL FOR ADDING COURSES:
const addCoursesModalButton = document.getElementById("add-courses-modal-button");

addCoursesModalButton.addEventListener('click', function() {
    const modal = document.getElementById('add-course-modal');
    modal.showModal();
})

//CLOSE THE MODAL
const closeModalButton = document.getElementById("close-modal");
closeModalButton.addEventListener('click', function() {
    const modal = document.getElementById('add-course-modal');
    modal.close();
})


//WHEN THE USER IS ENTERING A COURSE CODE - CHECK WHICH SECTIONS EXIST FOR THIS COURSE CODE - CREATE ARRAY OF SECTIONS
const courseCodeInput = document.getElementById("ask-code");
courseCodeInput.addEventListener('keyup', async function() {
    if(courseCodeInput.value.length == 8) { //a valid course code should have 8 characters: 'AAAA 111'
        //fetch the route to get course sections from ids
        //remove spaces from the course code - to avoid errors
        const courseCode = courseCodeInput.value.slice(0,4) + courseCodeInput.value.slice(5);
        const response = await fetch(`/api/instructor/get-sections-from-course-code/${courseCode}`);
        const sections = await response.json(); //already available sections for the course code entered
        const element = document.getElementById("course-select-section");
        generateSectionsDropDown(sections, element);
    }
})
//GENERATE THE SECTION DROPDOWN
async function generateSectionsDropDown(sections, element) {
    //sections is an array of sections
    //element is the html element where the dropdown needs to be inserted
    //Remove the sections that are already taken for this course code
    let allowedSections;
    if(sections.length == 0) { //invalid course, i.e. has no sections
        element.innerHTML += `<option >Invalid</option>`;
    }
    const defaultAllSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    console.log("defaultAllSections:", defaultAllSections);
    //FILTER ALLOWED SECTIONS
    const allowedSectionsPromise = defaultAllSections.filter( (value, index, array) => {
        return !(sections.includes(value));
    })
    allowedSections = await Promise.all(allowedSectionsPromise);
    allowedSections.forEach((value, index, array) => {
        element.innerHTML += `<option value=${value}>${value}</option>`;
    })
}











/** TECHNICALLY FOR STUDENTS...MOVE THERE
//GENERATE DROPDOWN OPTIONS FOR THE COURSE SECTION IN THE MODAL FOR WHEN A COURSE IS ADDED
const courseCodeInput = document.getElementById("ask-code");
courseCodeInput.addEventListener('keyup', async function() {
    console.log("reached event listener");
    console.log(courseCodeInput.value);
    if(courseCodeInput.value.length == 8) { //a valid course code should have 8 characters: 'AAAA 111'
        //fetch the route to get course sections from ids
        //remove spaces from the course code - to avoid errors
        const courseCode = courseCodeInput.value.slice(0,4) + courseCodeInput.value.slice(5);
        const response = await fetch(`/api/instructor/get-sections-from-course-code/${courseCode}`);
        const sections = await response.json(response);
        console.log("possible sections:",sections);
        const element = document.getElementById("course-select-section");
        generateSectionsDropDown(sections, element);
    }
})

async function generateSectionsDropDown(sections, element) {
    //sections is an array of sections
    //element is the html element where the dropdown needs to be inserted
    if(sections.length == 0) { //invalid course, i.e. has no sections
        element.innerHTML += `<option >Invalid</option>`;
    }
    sections.forEach((value, index, array) => {
        element.innerHTML += `<option value=${value}>${value}</option>`;
    })
}
*/






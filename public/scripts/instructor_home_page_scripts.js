console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession);
console.log("reached scripts");



let userId;

let instructorFinalCoursesArray = []; //array of instructor courses

//get instructorId
async function getSession() {
    const response = await fetch("/api/instructor/session");
    const session = await response.json();
    if(!session) {
        const response = await fetch("/instructor/sign-in");
    }
    userId = session.userId;
    await loadHomePage();
}

//load the home page with the courses of the instructor
async function loadHomePage() {
    instructorFinalCoursesArray = [];
    const instructorId = userId;
    const response = await fetch(`/api/instructor/get-courses/${instructorId}`); 
    const instructorCourses = await response.json(); //JSON: instructorId and courseId
    await Promise.all(instructorCourses.map( async (value, index, array) => {
        //get courses from courseIds
        const courseId = value.courseId;
        const response = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
        const [course] = await response.json();
        //get course info from JSON object
        instructorFinalCoursesArray.push(course); //add to array of courses
        const title = course.title;
        const code = course.code;
        const section = course.section;
        await addCourseToHomePage(code, title, section, courseId);
    })
)}
    


//funtion to add course to home page
async function addCourseToHomePage(code, title, section, courseId) {
    const courseArea = document.getElementById("course-area");
    courseArea.innerHTML += `<div class="course">
                                <div class="course-image course-img-1"></div>
                                <div class="course-info-text-area" >
                                    <p class="course-code">${code}<button type="button" class="edit-course-3-dots"></button></p>
                                    <a class ="course-info-text-a" href="course-page">
                                    <p class="course-name">${title}</p>
                                    <p class="course-section">Section ${section}</p>
                                    </a>
                                </div>
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

//EDIT COURSES MODAL
const editCoursesAnchor = document.getElementById("edit-courses-icon-anchor");
const EditOrDeletePopUp = document.getElementById("edit-or-delete-pop-up");
editCoursesAnchor.addEventListener("mouseenter", async ()=> {
    await createEditCourseList();
    EditOrDeletePopUp.showModal();
})

EditOrDeletePopUp.addEventListener("mouseenter", async () => {
    await createEditCourseList();
    EditOrDeletePopUp.showModal();
})

editCoursesAnchor.addEventListener("mouseleave", async () => {
    EditOrDeletePopUp.close();
})

//Generate the list of courses to put in the pop-up when the pop up is hovered
async function createEditCourseList() {
    const editCoursesList = document.getElementById("list-of-courses-to-edit");
    editCoursesList.innerHTML = "";

        await Promise.all( instructorFinalCoursesArray.map( async (value, index, array) => {
            const code = value.code;
            const section = value.section;
            const courseId = value.courseId;
            editCoursesList.innerHTML += `<ul><button value=${courseId} id="edit-course-button-option">${code} - ${section}</button></ul>`

        }) )


    
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






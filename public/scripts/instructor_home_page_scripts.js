console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession);




let userId;

let instructorCoursesArray; //array of instructor courses


//get instructorId
async function getSession() {
    const response = await fetch("/api/instructor/session");
    const session = await response.json();
    if (!session) {
        window.location.href = "/instructor/sign-in";
    }
    userId = session.userId;

    // Display instructor info FIRST
    const response2 = await fetch(`/api/instructor/get-instructors/${userId}`);
    const instructor = await response2.json();
    if (instructor && instructor[0]) {
        const firstName = instructor[0].firstName;
        const lastName = instructor[0].lastName;
        const initials = firstName[0] + '.' + lastName[0];
        document.querySelector('.center-title').textContent = `WELCOME PROF. ${lastName.toUpperCase()}`;
        const courseResponse = await fetch(`/api/instructor/get-courses/${userId}`);
        const courses = await courseResponse.json();
        document.querySelector('.current-course-count').textContent = `YOU'RE CURRENTLY MANAGING ${courses.length} COURSES`;
        document.getElementById('username').textContent = initials;
        document.querySelector('.instructor-id').textContent = userId;
    }

    await loadHomePage();
}
//load the home page with the courses of the instructor
async function loadHomePage() {
    instructorCoursesArray = [];
    const instructorId = userId;
    const response = await fetch(`/api/instructor/get-courses/${instructorId}`);
    const instructorCourses = await response.json(); //JSON: instructorId and courseId
    await Promise.all(instructorCourses.map(async (value, index, array) => {
        //get courses from courseIds
        const courseId = value.courseId;
        const response = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
        const [course] = await response.json();
        //get course info from JSON object
        instructorCoursesArray.push(course); //add to array of courses
        const title = course.title;
        const code = course.code;
        const section = course.section;
        const background = course.background;
        await addCourseToHomePage(code, title, section, courseId, background);
    })
    )
}



//funtion to add course to home page
async function addCourseToHomePage(code, title, section, courseId, background) {
    const courseArea = document.getElementById("course-area");
    courseArea.innerHTML += `<div class="course">
                                <div class="course-image course-img-${background}"></div>
                                <div class="course-info-text-area" >
                                    <p class="course-code">${code}<button type="button" class="edit-course-3-dots"></button></p>
                                    <a class ="course-info-text-a" href="course-page?courseId=${courseId}">
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

//LEFT MENU CLASSES DROPDOWN --IN PROGRESS
/**
const allClassesMenuOption = document.getElementById("left-menu-all-classes");
allClassesMenuOption.addEventListener("click", generateClassMenuDropDown);
allClassesMenuOption.addEventListener
async function generateClassMenuDropDown() {
    const allClassesDropDown = document.getElementById("all-classes-menu-dropdown");
    allClassesDropDown.innerHTML = "";
    for( const course of instructorCoursesArray) {
        const code = course.code;
        const section = course.section;
        allClassesDropDown.innerHTML += `<a class = "all-classes-option">${code} - ${section}</a>`;
    }
}
    */



//MODAL FOR ADDING COURSES:
const addCoursesModalButton = document.getElementById("add-courses-modal-button");
const addCoursesModal = document.getElementById('add-course-modal');
addCoursesModalButton.addEventListener('click', function () {
    addCoursesModal.showModal();
})

//CLOSE THE MODAL
const closeModalButton = document.getElementById("add-courses-close-modal");
closeModalButton.addEventListener('click', function () {
    addCoursesModal.close();
})


//WHEN THE USER IS ENTERING A COURSE CODE - CHECK WHICH SECTIONS EXIST FOR THIS COURSE CODE - CREATE ARRAY OF SECTIONS FOR ADD COURSE MODAL
const courseCodeInputAdd = document.getElementById("add-courses-ask-code");
courseCodeInputAdd.addEventListener('keyup', async function () {
    if (courseCodeInputAdd.value.length == 8) { //a valid course code should have 8 characters: 'AAAA 111'
        //fetch the route to get course sections from ids
        //remove spaces from the course code - to avoid errors
        console.log(courseCodeInputAdd);
        const courseCode = courseCodeInputAdd.value.slice(0, 4) + courseCodeInputAdd.value.slice(5);
        const response = await fetch(`/api/instructor/get-sections-from-course-code/${courseCode}`);
        const sections = await response.json(); //already available sections for the course code entered
        const element = document.getElementById("add-courses-select-section");
        generateSectionsDropDown(sections, element, "add");
    }
})
//GENERATE THE SECTION DROPDOWN
async function generateSectionsDropDown(sections, element, modalType) {
    //sections is an array of sections
    //element is the html element where the dropdown needs to be inserted
    //Remove the sections that are already taken for this course code
    let allowedSections = [];
    if (modalType == "add") {
        element.innerHTML = "";
    }
    else if (modalType == "edit") {
        element.innerHTML = "<option value='null'>No change</option>";
    }

    if (sections.length != 0) {


        const defaultAllSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        console.log("defaultAllSections:", defaultAllSections);
        //FILTER ALLOWED SECTIONS
        const allowedSectionsPromise = defaultAllSections.filter((value, index, array) => {
            return !(sections.includes(value));
        })
        allowedSections = await Promise.all(allowedSectionsPromise);
        allowedSections.forEach((value, index, array) => {
            element.innerHTML += `<option value=${value}>${value}</option>`;
        })
    }
}

//EDIT COURSES MODAL
const editCoursesAnchor = document.getElementById("edit-courses-icon-anchor");
const EditOrDeletePopUp = document.getElementById("edit-or-delete-pop-up");
const editCourseModal = document.getElementById("edit-course-modal");
const editModalClose = document.getElementById("close-edit-modal");

editCoursesAnchor.addEventListener("click", async () => {
    await createEditCourseList();
    EditOrDeletePopUp.show();
})

EditOrDeletePopUp.addEventListener("mouseenter", async () => {
    await createEditCourseList();
    EditOrDeletePopUp.show();
})
editModalClose.addEventListener("click", async () => {
    editCourseModal.close();
})



//Generate the list of courses to put in the pop-up when the pop up is hovered
async function createEditCourseList() {
    const editCoursesList = document.getElementById("list-of-courses-to-edit");
    editCoursesList.innerHTML = "";

    await Promise.all(instructorCoursesArray.map(async (value, index, array) => {
        const code = value.code;
        const section = value.section;
        const courseId = value.courseId;
        editCoursesList.innerHTML += `<ul><button class="edit-specific-course-button" value=${courseId} id="edit-course-button-option-${index}">${code} - ${section}</button></ul>`

    }))

    const arrayOfEditCourseButtons = document.getElementsByClassName("edit-specific-course-button");


    Array.from(arrayOfEditCourseButtons).forEach(async (value, index, array) => {
        value.addEventListener("click", async (event) => {
            const courseIdToEdit = event.target.value;
            console.log("courseIdtoEdit:", courseIdToEdit);
            const courseCodeToEdit = event.target.innerHTML;
            const editModalTitle = document.getElementById("edit-modal-title");
            editModalTitle.innerHTML = `EDIT COURSE : ${courseCodeToEdit}`;
            const editButton = document.getElementById("edit-modal-edit-button");
            editButton.setAttribute("formaction", `/api/instructor/edit-course/${courseIdToEdit}`);
            const deleteButton = document.getElementById("edit-modal-delete-button");
            deleteButton.setAttribute("formaction", `/api/instructor/delete-course/${courseIdToEdit}`);
            editCourseModal.showModal();

        })
    });
}

//WHEN THE USER IS ENTERING A COURSE CODE - CHECK WHICH SECTIONS EXIST FOR THIS COURSE CODE - CREATE ARRAY OF SECTIONS
const courseCodeInputEdit = document.getElementById("edit-ask-code");

courseCodeInputEdit.addEventListener('keyup', async function () {
    if (courseCodeInputEdit.value.length == 8) { //a valid course code should have 8 characters: 'AAAA 111'
        //fetch the route to get course sections from ids
        //remove spaces from the course code - to avoid errors
        console.log(courseCodeInputEdit);
        const courseCode = courseCodeInputEdit.value.slice(0, 4) + courseCodeInputEdit.value.slice(5);
        const response = await fetch(`/api/instructor/get-sections-from-course-code/${courseCode}`);
        const sections = await response.json(); //already available sections for the course code entered
        const element = document.getElementById("edit-select-section");
        generateSectionsDropDown(sections, element, "edit");
    }
})


















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

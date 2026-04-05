const PORT = 8080;
console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession); //do getSession when the document loads
let userId;

let studentCoursesArray; //array of student courses


async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();
    userId = session.userId;
    // Display student info
    document.getElementById('username').textContent = session.firstName + " " + session.lastName;
    document.querySelector('.student-id').textContent = "ID: " + session.userId;
    loadHomePage();
    loadCalendar();
    loadDeadlines();

   
}

async function loadHomePage() {
    await loadCourses(); //retrieve and display all courses from the students ID

}

async function loadCourses() {
    //GET ALL COURSES FOR STUDENT AND ADD THEM TO THE MAIN COURSE PAGE
    studentCoursesArray = [];
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
        const coursebg = course.background;
        studentCoursesArray.push(course);
        //insert data into html elements
        await createCourse(code, section, title, coursebg, courseId);
    }))

}


//right now the function contains index - change to course backgroung image number
async function createCourse(code, section, title, coursebg, courseId) {
    const courseArea =  document.getElementById("course-area");
    courseArea.innerHTML += `<div class="course">
                                <div class="course-image course-img-${coursebg}"></div>
                                <a class="course-info-text" href='course-page?courseId=${courseId}'>
                                    <p class="course-code">${code}</p>
                                    <p class="course-name">${title}</p>
                                    <p class="course-section">Section ${section}</p>
                                </a>
                            </div>`;
}


//LOAD THE CALENDAR ON THE RIGHT
async function loadCalendar() {
    let row;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const date = new Date();
    const today = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth();
    const calMonthYear = document.getElementById("cal-month-year");
    calMonthYear.innerHTML = months[month] + " " + year;

    const firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDay = firstDayDate.getDay() - 1; //day of the week of the first day of the month


    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    //populate the first week:
    let dayNumber = 1;
    for (let col = firstDay; col <= 7; col++) {
        let calDay = document.getElementById(`1-${col}`);
        calDay.innerHTML = dayNumber;
        calDay.classList.add("show");
        dayNumber++;
    }
    //find the remaining number of weeks
    const numWeeks = Math.floor(daysInMonth / 7);
    console.log("numWeeks:", numWeeks);
    for (let count = 1; count < numWeeks; count++) {
        for (let col = 1; col <= 7; col++) {
            row = 1+count;
            let calDay = document.getElementById(`${row}-${col}`);
            calDay.innerHTML = dayNumber;
            calDay.classList.add("show");
            dayNumber++;
        }

    }
    //find the remaining number of days
    const remainingDays = daysInMonth - dayNumber +1;
    row++;
    console.log("remaining days:", remainingDays);
    for(let col = 1; col <= remainingDays; col++ ) {
            let calDay = document.getElementById(`${row}-${col}`);
            calDay.innerHTML = dayNumber;
            calDay.classList.add("show");
            dayNumber++;

    }


}

async function loadDeadlines() {
    //all assignments
    console.log("reached load deadlines");
    const response = await fetch(`/api/student/get-incomplete-assignments/${userId}`);
    incompleteAssignments = await response.json();
    
    const deadlinesList = document.getElementById("deadlines-list");
    for(const assignment of incompleteAssignments) {
        const assignmentId = assignment.assignmentId;
        const response = await fetch(`/api/student/get-assignment-by-id/${assignmentId}`);
        const [fullAssignment] = await response.json();
        console.log("Keys:", Object.keys(fullAssignment));
        const dueDate = fullAssignment.dueDate;
        console.log("full assignment:", fullAssignment);
        console.log(dueDate);
        const formattedDueDate = (new Date(dueDate)).toLocaleDateString('en-GB', { month: 'long', day: 'numeric' });
        const title = fullAssignment.title;
        deadlinesList.innerHTML += `<div class="deadline-item"><a href="assignments"
                                class="deadline-item-anchor">${formattedDueDate} - ${title}</a></div>`;

    }
                                

}

//ADD COURSE MODAL
const addCoursesModalButton = document.getElementById("add-courses-modal-button");
const addCoursesModal = document.getElementById("add-course-modal");
const closeAddCoursesModalButton = document.getElementById("add-courses-close-modal");

addCoursesModalButton.addEventListener("click", async () => {
    addCoursesModal.showModal();
})
closeAddCoursesModalButton.addEventListener("click", async () => {
    addCoursesModal.close();
})

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



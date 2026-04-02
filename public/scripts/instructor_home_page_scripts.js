console.log('scripts loaded');
//document.addEventListener('DOMContentLoaded', getSession); //do getSession when the document loads
console.log("reached scripts");

const PORT = 8080;
const URL = `http://localhost${PORT}`;
let userId;

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



/**
//WAITING FOR INSTRUCTOR SESSION AND SIGN IN IS DEFINED
async function getSession() {
    const session = await fetch();
    userId = session.userId;
    loadHomePage();
}
    

async function loadHomePage() {
    await loadCourses();
}

async function loadCourses() {
    //temmporarily hardcode instructor id
    const instructorId = 2001;
    const response = await fetch(`${URL}/api/instructor/get-courses/${instructorId}`);
    const courseIds = await response.json();
    const courses = courseIds.forEach( async (value, index, array) => {
        response = await fetch(`${URL}/api/instructor`)
    })
    
}
    */
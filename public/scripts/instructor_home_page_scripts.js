console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession); //do getSession when the document loads

const PORT = 8080;
const URL = `http://localhost${PORT}`;
let userId;

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
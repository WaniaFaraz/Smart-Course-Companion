const express = require("express");
const router = express.Router();
const dir = __dirname;

//INSTRUCTOR ROUTES
//INSTRUCTOR SIGN-IN
router.get("/sign-in", (request, response) => {
    response.sendFile(dir + "/html/SignIn.html");
})
//INSTRUCTOR CREATE ACCOUNT
router.get("/create-account", (request, response) => {
    response.sendFile(dir + "/html/SignUp.html");
})
//INSTRUCTOR HOME PAGE
router.get("/home", (request, response) => {
    response.sendFile(dir + "/html/Instructor_HomePage.html");
})
//INSTRUCTOR COURSE PAGE
router.get("/course-page", (request, response) => {
    response.sendFile(dir + "/html/Instructor_CoursePage.html");
})
//INSTRUCTOR ACCOUNT SETTINGS
router.get("/account-settings", (request, response) => {
    response.sendFile(dir + "/html/Manage_Account.html");
})
//INSTRUCTOR COURSE TEMPLATES
router.get("/course-templates", (request, response) => {
    response.sendFile(dir + "/html/Instructor_templates.html");
})
//STUDENT TEMPLATE PREVIEW
router.get("/course-template-preview", (request, response) => {
    response.sendFile(dir + "/html/Student_templates.html");
})
//INSTRUCTOR MANAGE COURSES
router.get("/manage-courses", (request, response) => {
    response.sendFile(dir + "/html/Instructor_Manage_Courses.html");
})




//Temporary - to be modified for other use if necessary - can be used as an example for using the querying functions
//professor table queries
const {getInstructors, getInstructorById} = require("./database");
router.get('/get-instructors', async (request, response) => {
    const instructors = await getInstructors();
    response.json(instructors);
})
router.get('/get-instructors/:id', async (request, response) => {
    const instructor = await getInstructorById(id);
    response.json(instructor);
})

//ADD AN INSTRUCTOR
//add code here for adding instructors after collecting the account info
//note: there is an addInstructor(id, firstName, lastName, emailAddress) function
//      in the database file that will add the student to the database that can be used

//export routers
module.exports = router;
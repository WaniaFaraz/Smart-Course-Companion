const express = require("express");
const router = express.Router();
const dir = __dirname;
//Student routes
//STUDENT SIGN IN
router.get("/sign-in", (request, response) => {
    response.sendFile(dir + "/html/SignIn.html");
})
//STUDENT CREATE ACCOUNT
router.get("/create-account", (request, response) => {
    response.sendFile(dir + "/html/SignUp.html");
})
//HOME PAGE
router.get("/home", (request, response) => {
    response.sendFile(dir + "/html/HomePage.html");
})
//COURSE HOME PAGE
router.get("/course-page", (request, response) => {
    response.sendFile(dir + "/html/coursePage.html");
})
//ASSIGNMENTS FOR STUDENTS
router.get("/assignments", (request, response) => {
    response.sendFile(dir + "/html/ManageAssessments_Page.html");
})
//COURSE TEMPLATES FOR STUDENTS (MADE BY PROFESSORS)
router.get("/course-templates", (request, response) => {
    response.sendFile(dir + "/html/Student_templates.html");
})
//STUDENT ACCOUNT SETTINGS
router.get("/account-settings", (request, response) => {
    response.sendFile(dir + "/html/ManageAccount.html");
})
//STUDENT LOG OUT PAGE
router.get("/log-out", (request, response) => {
    response.sendFile(dir + "/html/LogOut.html");
})



//DATABASE QUERIES
//Temporary - to be modified for other use if necessary - can be used as an example for using the querying functions
const { getStudents, getStudentById } = require("./database");
//GET ALL STUDENTS - RETURNS AN ARRAY OF STUDENT JSON OBJECTS
router.get('/get-students', async (request, response) => {
    const students = await getStudents();
    response.json(students);
});
//GET A STUDENT FROM THE ID
router.get('/get-students/:id', async (request, response) => {
    const id = request.params.id;
    const student = await getStudentById(id);
    response.json(student);
})
//ADD A STUDENT
//add code here for adding students after creating the account info
//note: there is an addstudent(id, firstName, lastName, emailAddress) function
//      in the database file that will add the student to the database that can be used






//export routes.js file
module.exports = router;
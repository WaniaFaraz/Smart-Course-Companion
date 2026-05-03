//GOAL OF FILE:
//  Contains all the routes to navigate between pages for students
//  Most likely should not require any additional routes - ask 

//import necessary modules
const express = require("express"); //for css and js files
const router = express.Router({ mergeParams: true }); //mergeParams so that params get received too CHECK IF NECESSARY
const dir = __dirname.slice(0,-7); //remove the "/routes" part from the directory. (Since using ../ causes a "forbidden" message to appear)
//Student routes : all urls starting with "/student"
//STUDENT SIGN IN
router.get("/sign-in", (request, response) => {
    response.sendFile(dir + "/html/sign_in.html");
})
//STUDENT CREATE ACCOUNT
router.get("/create-account", (request, response) => {
    response.sendFile(dir + "/html/sign_up.html");
})
//HOME PAGE
router.get("/home", (request, response) => {
    console.log(dir);
    response.sendFile(dir + "/html/student_home_page.html");
})

//HOME PAGE POST redirect
router.post("/home/", (request, response) => {
    response.redirect(303, "/student/home");
})

router.post("/home", (request, response) => {
    response.redirect(303, "/student/home");
})

//COURSE HOME PAGE
router.get("/course-page", (request, response) => {
    response.sendFile(dir + "/html/student_course_page.html");
})
//ASSIGNMENTS FOR STUDENTS
router.get("/assignments", (request, response) => {
    response.sendFile(dir + "/html/manage_assessments.html");
})
//ANNOUNCEMENTS FOR STUDENT
router.get("/announcements", (request, response) => {
    response.sendFile(dir + "/html/student_announcements.html");
})
//COURSE TEMPLATES FOR STUDENTS (MADE BY PROFESSORS)
router.get("/course-templates", (request, response) => {
    response.sendFile(dir + "/html/student_templates.html");
})
//STUDENT ACCOUNT SETTINGS
router.get("/account-settings", (request, response) => {
    response.sendFile(dir + "/html/manage_account.html");
})
//STUDENT LOG OUT PAGE
router.get("/log-out", (request, response) => {
    request.session.destroy();
    response.sendFile(dir + "/html/sign_out.html");
})


//export routes.js file
module.exports = router;
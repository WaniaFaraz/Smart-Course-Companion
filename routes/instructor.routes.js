//GOAL OF FILE:
//  Contains all the routes to navigate between pages for instructors
//  Most likely should not require any additional routes - ask 

const express = require("express");
const router = express.Router();
const dir = __dirname.slice(0,-7);

//INSTRUCTOR ROUTES : all urls starting with "/instructor"
//INSTRUCTOR SIGN-IN
router.get("/sign-in", (request, response) => {
    response.sendFile(dir + "/html/instructor_sign_in.html");
})
//INSTRUCTOR CREATE ACCOUNT
router.get("/create-account", (request, response) => {
    response.sendFile(dir + "/html/sign_up.html");
})
//INSTRUCTOR HOME PAGE
router.get("/home", (request, response) => {
    response.sendFile(dir + "/html/instructor_home_page.html");
})
//INSTRUCTOR COURSE PAGE
router.get("/course-page", (request, response) => {
    response.sendFile(dir + "/html/instructor_course_page.html");
})
//INSTRUCTOR ACCOUNT SETTINGS
router.get("/account-settings", (request, response) => {
    response.sendFile(dir + "/html/manage_account.html");
})
//INSTRUCTOR COURSE TEMPLATES
router.get("/course-templates", (request, response) => {
    response.sendFile(dir + "/html/instructor_templates.html");
})
//STUDENT TEMPLATE PREVIEW
router.get("/course-template-preview", (request, response) => {
    response.sendFile(dir + "/html/student_templates.html");
})
//INSTRUCTOR MANAGE COURSES
router.get("/manage-courses", (request, response) => {
    response.sendFile(dir + "/html/instructor_manage_courses.html");
})

//INSTRUCTOR LOG OUT
router.get("/log-out", (request, response) => {
    request.session.destroy();
    response.sendFile(dir + "/html/instructor_log_out.html");
})
//export routers
module.exports = router;
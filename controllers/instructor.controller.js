//Instructor section of api - INCOMPLETE (more functions may be needed)
//GOAL OF FILE:
//  any time there is data required for the instructor pages, its function is here
//  how to use:
//      in the individual scripts files for each page (ex: home_page_scripts.js)
//      use fetch("url") - the url start with "/api/instructor"
//      the rest of the url depends on what info is needed
//          ex: to get all instructors,  use fetch("/api/instructor/get-instructors") - see comments and functions below
//          to use that data, and the functions, see example in home_page_scripts.js
const express = require("express");
const router = express.Router();

//IMPORT QUERY FUNCTIONS
//INSTRUCTOR DATA QUERY FUNCTIONS
const {
    getInstructors,
    getInstructorById,
} = require("../database/instructor.database");
//CERTAIN COURSE DATA QUERY FUNCTIONS
const {
    getCoursesOfInstructor
} = require("../database/courses.database");


//Routes that process data requests from scripts files - send data to html and receive data from html
//GET ALL INSTRUCTORS
router.get('/get-instructors', async (request, response) => {
    const instructors = await getInstructors();
    response.json(instructors);
})
//GET INSTRUCTOR BY ID
router.get('/get-instructors/:id', async (request, response) => {
    const instructor = await getInstructorById(id);
    response.json(instructor);
})

//ADD AN INSTRUCTOR - USE MULTER
//add code here for adding instructors after collecting the account info
//note: there is an addInstructor(id, firstName, lastName, emailAddress) function
//      in the database file that will add the student to the database that can be used

//GET COURSES OF A SPECIFIC INSTRUCTOR
router.get('/get-courses/:instructorid', async (request, response) => {
    const instructorid = request.params.instructorid;
    const courses = await getCoursesOfInstructor(instructorid);
    response.json(courses);
})

module.exports = router;
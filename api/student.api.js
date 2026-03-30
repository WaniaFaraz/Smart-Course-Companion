//Student section of api - INCOMPLETE (more functions may be needed)
//GOAL OF FILE:
//  any time there is data required for the student pages, its function is here
//  how to use:
//      in the individual scripts files for each page (ex: home_page_scripts.js)
//      use fetch("url") - the url start with "/api/student"
//      the rest of the url depends on what info is needed
//          ex: to get all students,  use fetch("/api/student/get-students") - see comments and functions below
//          to use that data, and the functions, see example in home_page_scripts.js
// Note: in order to use a querying function here, you need to import it here - see below
const express = require("express");
const router = express.Router();

//IMPORT DATABASE QUERY FUNCTIONS
const {
    getStudents,
    getStudentById,
    getCoursesOfStudent,
    getCourseFromCode,
} = require("../database"); //import querying functions from the database file

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
//ADD A STUDENT - unfinished (probably post...)
router.get('/add-student', async (request, response) => {
    
})

//GET COURSES OF A SPECIFIC STUDENT
router.get('/get-courses/:studentid', async (request, response) => {
    const studentid = request.params.studentid;
    const courses = await getCoursesOfStudent(studentid);
    response.json(courses);
})

//GET COURSE NAME FROM COURSE CODE
router.get('/get-course-from-code/:coursecode', async (request, response) => {
    const coursecode = request.params.coursecode;
    const course = await getCourseFromCode(coursecode);
    response.json(course);
})

module.exports = router;
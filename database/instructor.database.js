//GOAL OF FILE:
//  Contains all the functions to retrieve data from and store data in the database related to instructors
//  (In other words: this file contains the functions that query the database)

//INSTRUCTIONS TO USE DATABASE
//  The database used is a mySQL database
//  (From slides on databases) Install xampp - this has mySQL, apache,...
//  Open the xampp control panel and start apache and mySQL
//  Go to the browser and type: "localhost" - this should lead to the xampp dashboard
//  Click on phpmyadmin

// INSTRUCTIONS TO GET DATABASE: see student.database.js

//QUERY FUNCTIONS
//  Most of the querying functions required can be found here
//  If any more are needed, here is the template: (things within <> are what you need to replace)
/**     async function <function name> () {
 *         const [rows] = await pool.query(<queryString>);
 *          return rows;
 *      }
 *   Note: the queryString is a mySQL command. You can get it by copy and pasting commands from mySQL in phpMyAdmin
*/
// After creating a function, make sure to include it in the exports at the very bottom of the file

const pool = require("./database.js");

//Get all instructors
async function getInstructors() {
    const [instructors] = await pool.query('SELECT * FROM `instructors`');
    return instructors;
    //rows: array of JSON objects containing instructorId, firstName, lastName, emailAddress, password
}

//Get instructor by email (for login)
async function getInstructorByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM `instructors` WHERE `emailAddress` = ?', [email]);
    return rows;
}

//Get instructors from id
async function getInstructorById(id) {
    const [rows] = await pool.query('SELECT * FROM `instructors` WHERE `instructorId` = ?', [id]);
    return rows;
    //rows: array of JSON objects containing instructorId, firstName, lastName, emailAddress, password
}

//add an instructor
async function addInstructor(instructorId, firstName, lastName, emailAddress) {
    const queryString = "INSERT INTO `instructors` (`instructorId`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (?, ?, ?, ?)";
    await pool.query(queryString, [instructorId, firstName, lastName, emailAddress]);
    console.log("Instructor added with ID: ", instructorId);
}

//Get all students for an instructor
async function getStudentsOfInstructor(instructorId) {
    //get courseIds of the courses taught by this instructor
    const queryString = `
        SELECT DISTINCT s.* 
        FROM students s
        JOIN student_courses sc ON s.studentId = sc.studentId
        JOIN instructor_courses ic ON sc.courseId = ic.courseId
        WHERE ic.instructorId = ?`;
    const [rows] = await pool.query(queryString, [instructorId]);
    return rows;
}

//Add course to instructor in instructor_courses
async function instructorAddCourse(instructorId, courseId) {
    const queryString = 'INSERT INTO `instructor_courses` (`instructorId`, `courseId`) VALUES (?, ?)';
    await pool.query(queryString, [instructorId, courseId]);
    console.log("course added to instructor");
}

//Export all functions
module.exports = { 
    getInstructors,
    getInstructorById,
    addInstructor,
    getStudentsOfInstructor,
    getInstructorByEmail,
    instructorAddCourse
};


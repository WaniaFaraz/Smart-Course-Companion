//GOAL OF FILE:
//  Contains all the functions to retrieve data from and store data in the database
//  (In other words: this file contains the functions that query the database)

//INSTRUCTIONS TO USE DATABASE
//  The database used is a mySQL database
//  (From slides on databases) Install xampp - this has mySQL, apache,...
//  Open the xampp control panel and start apache and mySQL
//  Go to the browser and type: "localhost" - this should lead to the xampp dashboard
//  Click on phpmyadmin
//  **INSTRUCTIONS TO GET DATABASE COMING SOON**

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


const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info" //name of the database
}).promise() //use pool whenever accessing the database


//Get all students
async function getStudents() {
    const [rows] = await pool.query('SELECT * FROM `students`');
    return rows;
}

//Get a student by ID
async function getStudentById(id) {
    const [rows] = await pool.query('SELECT * FROM `students` WHERE `studentID` = ?', [id]);
    return rows;
}

//add a student
async function addStudent(studentID, firstName, lastName, emailAddress) {
    const queryString = "INSERT INTO `students` (`studentID`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (?, ?, ?, ?)";
    await pool.query(queryString, [studentID, firstName, lastName, emailAddress]);
    console.log("Student added with ID: ", studentID);
}


//Get all instructors
async function getInstructors() {
    const [instructors] = await pool.query('SELECT * FROM `professors`');
    return instructors;
}

//Get instructors from id
async function getInstructorById(id) {
    const [rows] = await pool.query('SELECT * FROM `professors` WHERE `professorID` = ?', [id]);
    return rows;
}

async function addInstructor(instructorId, firstName, lastName, emailAddress) {
    const queryString = "INSERT INTO `professors` (`professorID`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (?, ?, ?, ?)";
    await pool.query(queryString, [instructorId, firstName, lastName, emailAddress]);
    console.log("Instructor added with ID: ", professorID);
}

//Get courses of a specific instructor
async function getCoursesOfInstructor(instructorId) {
    const queryString = "SELECT * FROM `courses` WHERE `Code` = ?"; //TO BE EDITED
}


//Get courses of a specific student
async function getCoursesOfStudent(studentid) {
    const queryString = "SELECT * FROM `student_courses` WHERE `studentID` = ?";
    const [rows] = await pool.query(queryString, [studentid]);
    return rows;
}
//Get course name from the course code
async function getCourseFromCode(courseCode) {
    const queryString = "SELECT * FROM `courses` WHERE `Code` = ?";
    const fixedCode = courseCode.slice(0,4) + " " + courseCode.slice(4); //add back the whitespace that was removed in the scripts file
    const [rows] = await pool.query(queryString, [fixedCode]);
    if(rows && rows.length > 0) {
        return rows[0];
    }
    else {
        console.log("Course not found");
    }
}

module.exports = { 
    getStudents,
    getStudentById,
    addStudent,
    addInstructor,
    getInstructors,
    getInstructorById,
    getCoursesOfStudent,
    getCourseFromCode
};


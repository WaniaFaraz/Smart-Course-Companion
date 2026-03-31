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

const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info" //name of the database
}).promise() //use pool whenever accessing the database

let queryString;
let rows;
let instructors;

//import functions that are used within these functions
const {
    getStudentsOfCourse
} = require("./courses.database");

//Get all instructors
async function getInstructors() {
    [instructors] = await pool.query('SELECT * FROM `professors`');
    return instructors;
}

//Get instructors from id
async function getInstructorById(id) {
    [rows] = await pool.query('SELECT * FROM `professors` WHERE `professorID` = ?', [id]);
    return rows;
}

//add an instructor
async function addInstructor(instructorId, firstName, lastName, emailAddress) {
    queryString = "INSERT INTO `professors` (`professorID`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (?, ?, ?, ?)";
    await pool.query(queryString, [instructorId, firstName, lastName, emailAddress]);
    console.log("Instructor added with ID: ", professorID);
}

//Get all students for an instructor
async function getStudentsOfInstructor(instructorId) {
    //get courseIds of the courses taught by this instructor
    queryString = "SELECT * FROM `instructor_courses` WHERE `instructorId` = ?";
    [rows] = await pool.query(queryString, [instructorId]);
    console.log("rows: ", rows);
    //rows: array of json objects that contains the instructorId and the courseId
    //call function that gets the students of a course for each of the courseIds in the rows array
    const studentPromises = await rows.map( async (value, index, rows) => {
        const student = await getStudentsOfCourse(value.courseId);
        return student;
        
    })
    const students = await Promise.all(studentPromises);
    console.log(students.flat());
    return students.flat(); //1D array of students in json object format
}

//Export all functions
module.exports = { 
    getInstructors,
    getInstructorById,
    addInstructor
};


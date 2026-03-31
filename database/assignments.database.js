//See student.database or instructor.database for details
// INSTRUCTIONS TO GET DATABASE: see student.database.js

const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info" //name of the database
}).promise() //use pool.query() whenever accessing the database

let queryString;
let rows;

//Queries the database for data related to assignments

//Get all assignments of an instructor
async function getAllAssignments() {
    queryString = "SELECT * FROM `assignments`";
    [rows] = await pool.query(queryString);
    return rows;
    //rows : array of JSON objects containing assignmentId, instructorId, courseId, title, description, weight, dateCreated, dueDate
}

//Get all assignments of a student

//Get all assignments of a specific course and section

//Get all assignments of a specific student due before a certain date


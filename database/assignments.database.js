//See student.database or instructor.database for details
// INSTRUCTIONS TO GET DATABASE: see student.database.js

//Queries the database for data related to assignments
const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info"
}).promise()

let queryString;
let rows;

//Get all assignments of an instructor
async function getAllAssignments() {
    queryString = "SELECT * FROM `assignments`";
    [rows] = await pool.query(queryString);
    return rows;
}

//Get all assignments of a specific course and section
async function getAllAssignmentsOfStudent(studentId) {
    queryString = `
        SELECT sa.studentId, sa.assignmentId, sa.courseId, sa.grade, sa.completed,
               a.title, a.description, a.weight, a.dueDate
        FROM student_assignments sa
        JOIN assignments a ON sa.assignmentId = a.assignmentId
        WHERE sa.studentId = ?
    `;
    [rows] = await pool.query(queryString, [studentId]);
    return rows;
}

//Get all assignments of a specific student due before a certain date
async function getAllAssignmentsFromCourseId(courseId) {
    queryString = "SELECT * FROM `assignments` WHERE `courseId` = ?";
    [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

module.exports = {
    getAllAssignments,
    getAllAssignmentsOfStudent,
    getAllAssignmentsFromCourseId
};
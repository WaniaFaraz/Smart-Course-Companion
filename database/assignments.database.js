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
async function getAllAssignmentsOfStudent(studentId) {
    queryString = "SELECT * FROM `student_assignments` WHERE `studentId` = ?";
    [rows] = await pool.query(queryString, [studentId]);
    return rows;
    //rows: array of JSON objects containing studentId, assignmentId, courseId, grade, completed
}

//Get all assignments of a specific course and section - based on courseId
async function getAllAssignmentsFromCourseId(courseId) {
    queryString = "SELECT * FROM `assignments` WHERE `courseId` = ?";
    [rows] = await pool.query(queryString, [courseId]);
    return rows;
    //rows: array of JSON objects containing assignmentId, instructorId, courseId, title, description, weight, dateCreated, dueDate
}

//Get all assignments of a specific student due before a certain date
async function getStudentAssignmentsDueBefore(studentId, date) {
    //get all the student assignments
    const studentAssignments = await getAllAssignmentsOfStudent(studentId); //JSON objects
    const assignmentIdsPromise = studentAssignments.map( async (value, index, array) => {
        return await value.assignmentId;
    });
    assignmentIds = Promise.all(assignmentIdsPromise); //list of assignmentIds of student
    const filteredAssignmentsPromise = assignmentIds.map( async (value, index, array) => {
        queryString = "SELECT  * FROM `assignments` WHERE `assignmentId` = ? AND `date` < ?";
        [rows] = await pool.query(queryString, [value.assignmentId]);
        return rows;
    });
    const filteredAssignments = await Promise.all(filteredAssignmentsPromise);
    return filteredAssignments.flat();
    
}

module.exports = {
    getAllAssignments,
    getAllAssignmentsOfStudent,
    getAllAssignmentsFromCourseId
};
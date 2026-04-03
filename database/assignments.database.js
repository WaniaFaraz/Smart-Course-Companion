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
               a.title, a.description, a.weight, a.dueDate,
               c.code, c.section
        FROM student_assignments sa
        JOIN assignments a ON sa.assignmentId = a.assignmentId
        JOIN courses c ON sa.courseId = c.courseId
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

// Get all assignments of an instructor 
async function getAssignmentsOfInstructor(instructorId) {
    queryString = "SELECT * FROM `assignments` WHERE `instructorId` = ?";
    [rows] = await pool.query(queryString, [instructorId]);
    return rows;
}

// Get assignments of a course 
async function getAssignmentsOfCourse(courseId) {
    queryString = "SELECT * FROM `assignments` WHERE `courseId` = ?";
    [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

// Add an assignment 
async function addAssignment(instructorId, courseId, title, description, weight, dueDate) {
    queryString = "INSERT INTO `assignments` (`instructorId`, `courseId`, `title`, `description`, `weight`, `dueDate`) VALUES (?, ?, ?, ?, ?, ?)";
    await pool.query(queryString, [instructorId, courseId, title, description, weight, dueDate]);
}

// Delete an assignment 
async function deleteAssignment(assignmentId) {
    queryString = "DELETE FROM `assignments` WHERE `assignmentId` = ?";
    await pool.query(queryString, [assignmentId]);
}

// Update an assignment 
async function updateAssignment(assignmentId, title, description, weight, dueDate) {
    queryString = "UPDATE `assignments` SET `title` = ?, `description` = ?, `weight` = ?, `dueDate` = ? WHERE `assignmentId` = ?";
    await pool.query(queryString, [title, description, weight, dueDate, assignmentId]);
}

// Get completion stats for each assignment in a course - Wiame
async function getCompletionStatsByCourse(courseId) {
    queryString = `
        SELECT a.assignmentId, a.title,
               COUNT(*) as total,
               SUM(sa.completed) as completedCount,
               ROUND(SUM(sa.completed) / COUNT(*) * 100, 0) as completionPercent
        FROM assignments a
        JOIN student_assignments sa ON a.assignmentId = sa.assignmentId
        WHERE a.courseId = ?
        GROUP BY a.assignmentId, a.title
    `;
    [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

module.exports = {
    getAllAssignments,
    getAllAssignmentsOfStudent,
    getAllAssignmentsFromCourseId,
    getAssignmentsOfInstructor,
    getAssignmentsOfCourse,
    addAssignment,
    deleteAssignment,
    updateAssignment,
    getCompletionStatsByCourse
};
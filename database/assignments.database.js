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




//Get all assignments of an instructor
async function getAllAssignments() {
    const queryString = "SELECT * FROM `assignments`";
    const [rows] = await pool.query(queryString);
    return rows;
}

//Get assignmnent by id
async function getAssignmentById(assignmentId) {
    const queryString = "SELECT * FROM `assignments` WHERE `assignmentId` = ?";
    const [rows] = await pool.query(queryString, assignmentId);
    return rows;
}

//Get all assignments of a specific course and section
async function getAllAssignmentsOfStudent(studentId) {
    const queryString = `
        SELECT sa.studentId, sa.assignmentId, sa.courseId, sa.grade, sa.completed,
               a.title, a.description, a.weight, a.dueDate,
               c.code, c.section
        FROM student_assignments sa
        JOIN assignments a ON sa.assignmentId = a.assignmentId
        JOIN courses c ON sa.courseId = c.courseId
        WHERE sa.studentId = ?
    `;
    const [rows] = await pool.query(queryString, [studentId]);
    return rows;
}

//Get all assignments of a specific student due before a certain date
async function getAllAssignmentsFromCourseId(courseId) {
    const queryString = "SELECT * FROM `assignments` WHERE `courseId` = ?";
    const [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

// Get all assignments of an instructor 
async function getAssignmentsOfInstructor(instructorId) {
    const queryString = "SELECT * FROM `assignments` WHERE `instructorId` = ?";
    const [rows] = await pool.query(queryString, [instructorId]);
    return rows;
}

//Get pending assignment of an instructor (the due date has not yet been reached)
async function getPendingInstructorAssignments(instructorId) {
    const queryString = "SELECT * FROM `assignments` WHERE `instructorId` = ? AND `dueDate` >= ?";
    const date = new Date();
    const [rows] = await pool.query(queryString, [instructorId, date]);
    return rows;
}

// Get assignments of a course 
async function getAssignmentsOfCourse(courseId) {
    const queryString = "SELECT * FROM `assignments` WHERE `courseId` = ?";
    const [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

// Add an assignment 
async function addAssignment(instructorId, courseId, title, description, weight, dueDate) {
    const queryString = "INSERT INTO `assignments` (`instructorId`, `courseId`, `title`, `description`, `weight`, `dueDate`) VALUES (?, ?, ?, ?, ?, ?)";
    await pool.query(queryString, [instructorId, courseId, title, description, weight, dueDate]);
}

// Delete an assignment 
async function deleteAssignment(assignmentId) {
    const queryString = "DELETE FROM `assignments` WHERE `assignmentId` = ?";
    await pool.query(queryString, [assignmentId]);
}

// Update an assignment 
async function updateAssignment(assignmentId, title, description, weight, dueDate) {
    const queryString = "UPDATE `assignments` SET `title` = ?, `description` = ?, `weight` = ?, `dueDate` = ? WHERE `assignmentId` = ?";
    await pool.query(queryString, [title, description, weight, dueDate, assignmentId]);
}

// Get completion stats for each assignment in a course - Wiame
async function getCompletionStatsByCourse(courseId) {
    const queryString = `
        SELECT a.assignmentId, a.title,
               COUNT(*) as total,
               SUM(sa.completed) as completedCount,
               ROUND(SUM(sa.completed) / COUNT(*) * 100, 0) as completionPercent
        FROM assignments a
        JOIN student_assignments sa ON a.assignmentId = sa.assignmentId
        WHERE a.courseId = ?
        GROUP BY a.assignmentId, a.title
    `;
    const [rows] = await pool.query(queryString, [courseId]);
    return rows;
}

// Get assignments of a student for a specific course 
async function getAssignmentsOfStudentByCourse(studentId, courseId) {
    const queryString = `
        SELECT sa.studentId, sa.assignmentId, sa.courseId, sa.grade, sa.completed,
               a.title, a.description, a.weight, a.dueDate,
               c.code, c.section
        FROM student_assignments sa
        JOIN assignments a ON sa.assignmentId = a.assignmentId
        JOIN courses c ON sa.courseId = c.courseId
        WHERE sa.studentId = ? AND sa.courseId = ?
    `;
    const [rows] = await pool.query(queryString, [studentId, courseId]);
    return rows;
}

//Get incompleted assignmnents of a student
async function getIncompleteAssignmentsOfStudent(studentId) {
    const queryString = "SELECT * FROM `student_assignments` WHERE `studentId` = ? AND `completed` = ?";
    const [rows] = await pool.query(queryString, [studentId, 0]);
    return rows;
}

// Get average grade per course for all students 
async function getAveragesByCourse(courseId) {
    const [rows] = await pool.query(
        `SELECT ROUND(AVG(grade), 2) AS average
         FROM student_assignments
         WHERE courseId = ?`,
        [courseId]
    );
    return rows[0];
}
module.exports = {
    getAllAssignments,
    getAssignmentById,
    getAllAssignmentsOfStudent,
    getAllAssignmentsFromCourseId,
    getAssignmentsOfInstructor,
    getAssignmentsOfCourse,
    addAssignment,
    deleteAssignment,
    updateAssignment,
    getCompletionStatsByCourse,
    getAssignmentsOfStudentByCourse,
    getIncompleteAssignmentsOfStudent,
    getPendingInstructorAssignments,
    getAveragesByCourse
};
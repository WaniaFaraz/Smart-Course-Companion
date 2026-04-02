const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info"
}).promise();

async function getGradesOfStudent(studentId) {
    const [rows] = await pool.query(
        "SELECT * FROM `student_assignments` WHERE `studentId` = ?", [studentId]
    );
    return rows;
}

async function addGrade(studentId, assignmentId, courseId, grade) {
    await pool.query(
        "INSERT INTO `student_assignments` (`studentId`, `assignmentId`, `courseId`, `grade`) VALUES (?, ?, ?, ?)",
        [studentId, assignmentId, courseId, grade]
    );
}

async function updateGrade(studentId, assignmentId, grade) {
    await pool.query(
        "UPDATE `student_assignments` SET `grade` = ? WHERE `studentId` = ? AND `assignmentId` = ?",
        [grade, studentId, assignmentId]
    );
}

async function getAveragesOfStudent(studentId) {
    const [rows] = await pool.query(
        `SELECT courseId, ROUND(AVG(grade), 2) AS average
         FROM student_assignments
         WHERE studentId = ? 
         GROUP BY courseId`,
        [studentId]
    );
    return rows;
}
//Mark assignments as completed/pending
async function updateCompleted(studentId, assignmentId, completed) {
    await pool.query(
        "UPDATE `student_assignments` SET `completed` = ? WHERE `studentId` = ? AND `assignmentId` = ?",
        [completed, studentId, assignmentId]
    );
}

// Delete a student assignment
async function deleteStudentAssignment(studentId, assignmentId) {
    await pool.query(
        "DELETE FROM `student_assignments` WHERE `studentId` = ? AND `assignmentId` = ?",
        [studentId, assignmentId]
    );
}

module.exports = {
    getGradesOfStudent,
    addGrade,
    updateGrade,
    getAveragesOfStudent,
    updateCompleted,
    deleteStudentAssignment
};
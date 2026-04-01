const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info"
}).promise();

async function getGradesOfStudent(studentId) {
    const [rows] = await pool.query(
        "SELECT * FROM `grades` WHERE `studentId` = ?", [studentId]
    );
    return rows;
}

async function addGrade(studentId, assignmentId, courseId, earnedMarks, totalMarks) {
    await pool.query(
        "INSERT INTO `grades` (`studentId`, `assignmentId`, `courseId`, `earnedMarks`, `totalMarks`) VALUES (?, ?, ?, ?, ?)",
        [studentId, assignmentId, courseId, earnedMarks, totalMarks]
    );
}

async function updateGrade(gradeId, earnedMarks, totalMarks) {
    await pool.query(
        "UPDATE `grades` SET `earnedMarks` = ?, `totalMarks` = ? WHERE `gradeId` = ?",
        [earnedMarks, totalMarks, gradeId]
    );
}

async function getAveragesOfStudent(studentId) {
    const [rows] = await pool.query(
        `SELECT courseId, 
                ROUND(SUM(earnedMarks) / SUM(totalMarks) * 100, 2) AS average
         FROM grades 
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
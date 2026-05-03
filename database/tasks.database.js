const pool = require("./database.js");

// Get all tasks of a student for a specific course
async function getTasksByStudent(studentId, courseId) {
    const [rows] = await pool.query(
        "SELECT * FROM tasks WHERE studentId = ? AND courseId = ?",
        [studentId, courseId]
    );
    return rows;
}

// Add a task
async function addTask(studentId, courseId, description) {
    await pool.query(
        "INSERT INTO tasks (studentId, courseId, description) VALUES (?, ?, ?)",
        [studentId, courseId, description]
    );
}

// Update task completed status
async function updateTaskStatus(taskId, completed) {
    await pool.query(
        "UPDATE tasks SET completed = ? WHERE taskId = ?",
        [completed, taskId]
    );
}

// Delete a task
async function deleteTask(taskId) {
    await pool.query(
        "DELETE FROM tasks WHERE taskId = ?",
        [taskId]
    );
}

module.exports = { getTasksByStudent, addTask, updateTaskStatus, deleteTask };
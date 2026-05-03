const pool = require("./database.js");

// Save a course template 
async function saveTemplate(courseId, instructorId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12) {
    await pool.query(
        `INSERT INTO course_templates (courseId, instructorId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         description = ?, textbook = ?, week1_2 = ?, week3_4 = ?, week5_6 = ?, week7_8 = ?, week9_10 = ?, week11_12 = ?`,
        [courseId, instructorId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12,
         description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12]
    );
}

// Get template by courseId 
async function getTemplateByCourse(courseId) {
    const [rows] = await pool.query(
        "SELECT * FROM course_templates WHERE courseId = ?", [courseId]
    );
    return rows[0];
}

module.exports = { saveTemplate, getTemplateByCourse };
const pool = require("./database.js");

async function getAnnouncementsOfCourse(courseId) {
    queryString = "SELECT * FROM `announcements` WHERE `courseId` = ?";
    const [rows] = await pool.query(queryString, [courseId]);
    console.log("announcements from database:",rows);
    return rows;
}

async function getAnnouncementFromId(announcementId) {
    queryString = "SELECT * FROM `announcements` WHERE `announcementId` = ?";
    const [rows] = await pool.query(queryString, [announcementId]);
    return rows;
}

async function createAnnouncement(instructorId, courseId, title, message) {
    queryString = "INSERT INTO `announcements` (`announcementId`, `instructorId`, `courseId`, `title`, `message`, `dateCreated`) VALUES (NULL, ?, ?, ?, ?, current_timestamp())";
    await pool.query(queryString, [instructorId, courseId, title, message]);
}

module.exports = {
    getAnnouncementsOfCourse,
    getAnnouncementFromId,
    createAnnouncement
};
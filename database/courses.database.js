//See student.database or instructor.database for details
// INSTRUCTIONS TO GET DATABASE: see student.database.js

//Queries the database for data related to courses


const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info" //name of the database
}).promise() //use pool.query() whenever accessing the database

let queryString;
let rows;

//import certain functions
const {
    instructorAddCourse
} = require("../database/instructor.database");

//Get all courses
async function getAllCourses() {
    queryString = "SELECT * FROM `courses`";
    [rows] = await pool.query(queryString);
    //rows: array of json objects containing courseId, title, code, section, visibility
}

//Get course from courseId
async function getCourseFromId(courseId) {
    queryString = "SELECT * FROM `courses` WHERE `courseId` = ?";
    [rows] = await pool.query(queryString, [courseId]);
    console.log("course from query",rows)
    return rows;
    //rows: an array of json objects containing courseId, title, code, section, visibility
}

//Get courses of a specific instructor
async function getCoursesOfInstructor(instructorId) {
    queryString = "SELECT * FROM `instructor_courses` WHERE `instructorId` = ?";
    [rows] = await pool.query(queryString, [instructorId]);
    return rows;
    //rows: array of json objects containing the instructorId and courseId
}


//Get courses of a specific student
async function getCoursesOfStudent(studentid) {
    queryString = "SELECT * FROM `student_courses` WHERE `studentID` = ?";
    [rows] = await pool.query(queryString, [studentid]);
    return rows;
    //rows: an array of json objects containing the studentId, courseCode, courseSection
}

//Get course name from the course code
async function getCourseFromCode(courseCode) {
    queryString = "SELECT * FROM `courses` WHERE `Code` = ?";
    const fixedCode = courseCode.slice(0,4) + " " + courseCode.slice(4); //add back the whitespace that was removed in the scripts file
    [rows] = await pool.query(queryString, [fixedCode]);
    if(rows && rows.length > 0) {
        return rows[0];
        //rows: an array of json objects containing courseId, title, code, section, visibility
    }
    else {
        console.log("Course not found");
    }
}

//Get all students of a course (based on courseId)
async function getStudentsOfCourse(courseId) {
    queryString = "SELECT * FROM `student_courses` WHERE `courseId` = ?";
    [rows] = await pool.query(queryString, [courseId]);
    return rows;
    //rows: array of json objects containing studentId, courseId, courseCode, courseSection
}

//Get all possible sections for a course code
async function getSectionsOfCourse(courseCode) {
    //Note that the course code received will not have spaces
    const fixedCourseCode = courseCode.slice(0,4) + " " + courseCode.slice(4); //re-add spaces
    queryString = "SELECT * FROM `courses` WHERE `code` = ?";
    [rows] = await pool.query(queryString, [fixedCourseCode]);
    const sectionsPromise = await rows.map( async(value, index, array) => {
        return value.section;
    })
    const sections = await Promise.all(sectionsPromise);
    //returns an array of sections, ex: ['X', 'Y']
    return sections;

}

async function createCourse(code, section, title, instructorId) {
    queryString = "INSERT INTO `courses` (`courseId`, `title`, `code`, `section`, `visibility`) VALUES (0, ?, ?, ?, ?);"
    await pool.query(queryString, [title, code, section, 1]);
    
    //ASSOCIATE TO PROFESSOR THAT CREATED THE COURSE!!!!!
    const [addedCourse] = await getCourseFromCodeAndSection(code, section);
    const courseId = addedCourse.courseId;
    instructorAddCourse(instructorId, courseId);

    
}

async function getCourseFromCodeAndSection(courseCode, courseSection) {
    queryString = "SELECT * FROM `courses` WHERE `code` = ? AND `section` = ?";
    [rows] = await pool.query(queryString, [courseCode, courseSection]);
    return rows;

}

//Export all functions
module.exports = { 
    getAllCourses,
    getCoursesOfInstructor,
    getCoursesOfStudent,
    getCourseFromCode,
    getStudentsOfCourse,
    getCourseFromId,
    getSectionsOfCourse,
    createCourse, 
    getCourseFromCodeAndSection
};
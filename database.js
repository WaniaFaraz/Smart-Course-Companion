//This is the file that holds all the functions that queries the database
//Add students, instructors, assignments,...
//Edit students, instructors, assignments,...

const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lms_info" //name of the database
}).promise() //use pool whenever accessing the database


//Get all students
async function getStudents() {
    const [rows] = await pool.query('SELECT * FROM `students`');
    return rows;
}

//Get a student by ID
async function getStudentById(id) {
    const [rows] = await pool.query('SELECT * FROM `students` WHERE `studentID` = ?', [id]);
    return rows;
}

//add a student
async function addStudent(studentID, firstName, lastName, emailAddress) {
    const queryString = "INSERT INTO `students` (`studentID`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (? ? ? ?)";
    await pool.query(queryString, [studentID, firstName, lastName, emailAddress]);
    console.log("Student added with ID: ", studentID);
}


//Get all instructors
async function getInstructors() {
    const [instructors] = await pool.query('SELECT * FROM `professors`');
    return instructors;
}

//Get instructors from id
async function getInstructorById(id) {
    const [rows] = await pool.query('SELECT * FROM `professors` WHERE `professorID` = ?', [id]);
    return rows;
}

async function addInstructor(instructorId, firstName, lastName, emailAddress) {
    const queryString = "INSERT INTO `professors` (`professorID`, `firstName`, `lastName`, `emailAddress`, `password`) VALUES (? ? ? ?)";
    await pool.query(queryString, [instructorId, firstName, lastName, emailAddress]);
    console.log("Instructor added with ID: ", professorID);
}

module.exports = { getStudents, getStudentById, addStudent,
                    addInstructor, getInstructors, getInstructorById};


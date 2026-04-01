//Student section of api - INCOMPLETE (more functions may be needed)
//GOAL OF FILE:
//  any time there is data required for the student pages, its function is here
//  how to use:
//      in the individual scripts files for each page (ex: home_page_scripts.js)
//      use fetch("url") - the url start with "/api/student"
//      the rest of the url depends on what info is needed
//          ex: to get all students,  use fetch("/api/student/get-students") - see comments and functions below
//          to use that data, and the functions, see example in home_page_scripts.js
// Note: in order to use a querying function here, you need to import it here - see below
const express = require("express");
const router = express.Router();

//IMPORT DATABASE QUERY FUNCTIONS
//STUDENT QUERY FUNCTIONS
const {
    getStudents,
    getStudentById,
    getStudentByEmail,
    addStudent,
    updateStudentInfo,
    updateStudentPassword
    
} = require("../database/student.database"); 
//CERTAIN COURSE QUERY FUNCTIONS
const {
    getCoursesOfStudent,
    getCourseFromCode,
    getCourseFromId
} = require("../database/courses.database"); 
//GRADES QUERY FUNCTIONS
const {
    getGradesOfStudent,
    
} = require("../database/grades.database"); 
//ASSIGNMENT QUERY FUNCTIONS
const {
     getAllAssignmentsOfStudent
} = require("../database/assignments.database");


//ROUTES TO DEAL WITH DATA REQUESTS FROM SCRIPTS FILES - SEND AND RECEIVE DATA TO AND FROM HTML
//GET ALL STUDENTS - RETURNS AN ARRAY OF STUDENT JSON OBJECTS
router.get('/get-students', async (request, response) => {
    const students = await getStudents();
    response.json(students);
});
//GET A STUDENT FROM THE ID
router.get('/get-students/:id', async (request, response) => {
    const id = request.params.id;
    const student = await getStudentById(id);
    response.json(student);
})
//ADD A STUDENT - unfinished (probably post...)
router.get('/add-student', async (request, response) => {
    
})

//GET COURSES OF A SPECIFIC STUDENT
router.get('/get-courses/:studentid', async (request, response) => {
    const studentid = request.params.studentid;
    const courses = await getCoursesOfStudent(studentid);
    response.json(courses);
})

//GET COURSE FROM COURSE_ID
router.get('/get-course-from-courseId/:courseId', async (request, response) => {
    const courseId = request.params.courseId;
    const course = await getCourseFromId(courseId);
    response.json(course);
})

//GET COURSE NAME FROM COURSE CODE
router.get('/get-course-from-code/:coursecode', async (request, response) => {
    const coursecode = request.params.coursecode;
    const course = await getCourseFromCode(coursecode);
    response.json(course);
})

//STUDENT LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.redirect('/student/sign-in?error=missing');
    const students = await getStudentByEmail(email);
    if (students.length === 0)
        return res.redirect('/student/sign-in?error=notfound');
    if (students[0].password !== password)
        return res.redirect('/student/sign-in?error=wrongpassword');
    req.session.userId = students[0].studentId;
    req.session.userType = "student";
    req.session.firstName = students[0].firstName;
    res.redirect(303, "/student/home");
});

//STUDENT SIGN UP
router.post('/sign-up', async (req, res) => {
    const { studentID, firstName, lastName, emailAddress, password, confirmPassword } = req.body;
    if (!studentID || !firstName || !lastName || !emailAddress || !password)
        return res.redirect('/student/create-account?error=missing');
    if (password !== confirmPassword)
        return res.redirect('/student/create-account?error=passwordmismatch');
    const existing = await getStudentByEmail(emailAddress);
    if (existing.length > 0)
        return res.redirect('/student/create-account?error=exists');
    await addStudent(studentID, firstName, lastName, emailAddress, password);
    res.redirect(303, "/student/sign-in?success=created");
});

//STUDENT LOGOUT
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect(303, "/student/sign-in");
});

//UPDATE PERSONAL INFO
router.post('/update-info', async (req, res) => {
    const { userId, firstName, lastName, emailAddress } = req.body;
    await updateStudentInfo(userId, firstName, lastName, emailAddress);
    res.redirect(303, "/student/account-settings?success=saved");
});

//UPDATE PASSWORD
router.post('/update-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const students = await getStudentById(userId);
    if (students[0].password !== currentPassword)
        return res.redirect('/student/account-settings?error=wrongpassword');
    await updateStudentPassword(userId, newPassword);
    res.redirect(303, "/student/account-settings?success=passwordupdated");
});

//GET ALL GRADES OF A STUDENT (for averages)
router.get('/get-grades/:studentid', async (req, res) => {
    res.json(await getGradesOfStudent(req.params.studentid));
});

//GET SESSION INFO
router.get('/session', (req, res) => {
    if (req.session.userId && req.session.userType === "student")
        res.json({ loggedIn: true, userId: req.session.userId, firstName: req.session.firstName });
    else
        res.json({ loggedIn: false });
});

//GET ALL ASSIGNMENTS OF A STUDENT
//Returns an array of objects containing studentId, assignmentId, courseId, grade, completed status
router.get('/get-assignments/:studentId', async (req, res) => {
    try {
        const assignments = await getAllAssignmentsOfStudent(req.params.studentId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//UPDATE COMPLETED STATUS OF AN ASSIGNMENT
//It requires studentId, assignmentId, completed (boolean value) in the request body
router.put('/update-completed', async (req, res) => {
    try {
        const { studentId, assignmentId, completed } = req.body;
        await updateCompleted(studentId, assignmentId, completed);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//DELETE A STUDENT ASSIGNMENT
router.delete('/delete-assignment', async (req, res) => {
    try {
        const { studentId, assignmentId } = req.body;
        await deleteStudentAssignment(studentId, assignmentId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Export the router object
module.exports = router;
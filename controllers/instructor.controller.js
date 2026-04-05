//Instructor section of api - INCOMPLETE (more functions may be needed)
//GOAL OF FILE:
//  any time there is data required for the instructor pages, its function is here
//  how to use:
//      in the individual scripts files for each page (ex: home_page_scripts.js)
//      use fetch("url") - the url start with "/api/instructor"
//      the rest of the url depends on what info is needed
//          ex: to get all instructors,  use fetch("/api/instructor/get-instructors") - see comments and functions below
//          to use that data, and the functions, see example in home_page_scripts.js
const express = require("express");
const router = express.Router();

//IMPORT QUERY FUNCTIONS
//INSTRUCTOR DATA QUERY FUNCTIONS
const {
    getInstructors,
    getInstructorById,
    getInstructorByEmail,
    addInstructor,
    getStudentsOfInstructor,
    instructorAddCourse
} = require("../database/instructor.database");

//CERTAIN COURSE DATA QUERY FUNCTIONS
const {
    getCoursesOfInstructor,
    getAllCourses,
    getSectionsOfCourse,
    createCourse,
    getCourseFromId,
    updateCourse,
    deleteCourse
} = require("../database/courses.database");

const {
    getAssignmentsOfInstructor,
    getAssignmentsOfCourse,
    addAssignment,
    deleteAssignment,
    updateAssignment,
    getCompletionStatsByCourse,
    getPendingInstructorAssignments
} = require("../database/assignments.database");

const { saveTemplate, getTemplateByCourse } = require("../database/templates.database");

const {
    getAnnouncementsOfCourse,
    getAnnouncementFromId,
    createAnnouncement,
} = require("../database/announcements.database");


//Routes that process data requests from scripts files - send data to html and receive data from html
//GET ALL INSTRUCTORS
router.get('/get-instructors', async (request, response) => {
    const instructors = await getInstructors();
    response.json(instructors);
})
//GET INSTRUCTOR BY ID
router.get('/get-instructors/:id', async (request, response) => {
    const id = request.params.id; // ← ajoute ça
    const instructor = await getInstructorById(id);
    response.json(instructor);
})


//GET COURSES OF A SPECIFIC INSTRUCTOR
router.get('/get-courses/:instructorid', async (request, response) => {
    const instructorid = request.params.instructorid;
    const courses = await getCoursesOfInstructor(instructorid);
    response.json(courses);
})

//INSTRUCTOR LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.redirect('/instructor/sign-in?error=missing');
    const instructors = await getInstructorByEmail(email);
    if (instructors.length === 0)
        return res.redirect('/instructor/sign-in?error=notfound');
    if (instructors[0].password !== password)
        return res.redirect('/instructor/sign-in?error=wrongpassword');
    req.session.userId = instructors[0].instructorId;
    req.session.userType = "instructor";
    req.session.firstName = instructors[0].firstName;
    res.redirect(303, "/instructor/home");
});

//INSTRUCTOR LOGOUT
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect(303, "/instructor/sign-in");
});

//GET SESSION INFO
router.get('/session', (req, res) => {
    if (req.session.userId && req.session.userType === "instructor")
        res.json({ loggedIn: true, userId: req.session.userId, firstName: req.session.firstName });
    else
        res.json({ loggedIn: false });
});

//GET ALL STUDENTS OF AN INSTRUCTOR
router.get('/get-all-students/:instructorId', async (request, response) => {
    const instructorId = request.params.instructorId;
    const students = await getStudentsOfInstructor(instructorId);
    console.log("students");
    response.json(students);
})

//GET COURSE FROM COURSE ID
router.get("/get-course-from-id/:courseId", async (request, response) => {
    const courseId = request.params.courseId;
    const course = await getCourseFromId(courseId);
    response.json(course);
})

//INSTRUCTOR ADD COURSE ---UNFINISHED
router.post('/add-course', async (request, response) => {
    //add course to instructor in database instructor_courses
    //const instructorId = session.userId;
    const courseCode = request.body.code;
    const courseSection = request.body.section;
    const courseTitle = request.body.title;
    const coursebg = request.body.radioCourseBg;
    const instructorId = request.session.userId;
    await createCourse(courseCode, courseSection, courseTitle, instructorId, coursebg);
    response.redirect("/instructor/home");

})

//INSTRUCTOR EDIT COURSE 
router.post('/edit-course/:courseId', async (request, response) => {
    const courseId = request.params.courseId;
    const courseCode = request.body.code;
    const courseSection = request.body.section;
    const courseTitle = request.body.title;
    const coursebg = request.body.radioCourseBg;
    await updateCourse(courseId, courseCode, courseSection, courseTitle, coursebg);
    response.redirect("/instructor/home");
})

//INSTRUCTOR DELETE COURSE
router.post('/delete-course/:courseId', async (request, response) => {
    const courseId = request.params.courseId;
    await deleteCourse(courseId);
    response.redirect("/instructor/home");
})
//GET COURSE BY ID
router.get('/get-course/:courseId', async (request, response) => {
    const courseId = request.params.courseId;
    const course = await getCourseFromId(courseId);
    response.json(course);
})

//GET THE SECTIONS OF A COURSE BASED ON COURSE CODE
router.get('/get-sections-from-course-code/:courseCode', async(request, response) => {
    const courseCode = request.params.courseCode;
    const sections = await getSectionsOfCourse(courseCode);
    response.json(sections);
})

//GET ALL ASSIGNMENTS OF A COURSE 
router.get('/get-assignments/:courseId', async (req, res) => {
    try {
        const assignments = await getAssignmentsOfCourse(req.params.courseId);
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//GET COMPLETION STATS FOR EACH ASSIGNMENT IN A COURSE 
router.get('/get-completion-stats/:courseId', async (req, res) => {
    try {
        const stats = await getCompletionStatsByCourse(req.params.courseId);
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// UPDATE AN ASSIGNMENT 
router.put('/update-assignment/:assignmentId', async (req, res) => {
    try {
        const { title, description, weight, dueDate } = req.body;
        await updateAssignment(req.params.assignmentId, title, description, weight, dueDate);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// CREATE AN ASSIGNMENT 
router.post('/create-assignment', async (req, res) => {
    try {
        const { instructorId, courseId, title, description, weight, dueDate } = req.body;
        await addAssignment(instructorId, courseId, title, description, weight, dueDate);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//GET PENDING INSTRUCTOR ASSIGNMENTS
router.get('/get-pending-assignments/:instructorId', async (request, response) => {
    const instructorId = request.params.instructorId;
    const assignments = await getPendingInstructorAssignments(instructorId);
    response.json(assignments);
})

// SAVE COURSE TEMPLATE 
router.post('/save-template', async (req, res) => {
    try {
        const instructorId = req.session.userId;
        const { courseId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12 } = req.body;
        await saveTemplate(courseId, instructorId, description, textbook, week1_2, week3_4, week5_6, week7_8, week9_10, week11_12);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// GET COURSE TEMPLATE 
router.get('/get-template/:courseId', async (req, res) => {
    try {
        const template = await getTemplateByCourse(req.params.courseId);
        res.json(template || {});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

//GET ALL ANNOUNCEMENTS OF A COURSE
router.get('/get-announcements-of-course/:courseId', async (request, response) => {
    const courseId = request.params.courseId;
    const announcements = await getAnnouncementsOfCourse(courseId);
    response.json(announcements);
})

//GET ANNOUNCEMENT FROM ANNOUNCEMENT ID
router.get('/get-announcement/:announcementId', async (request, response) => {
    const announcementId = request.params.announcementId;
    const announcement = await getAnnouncementFromId(announcementId);
    response.json(announcement);
})

//CREATE ANNOUNCEMENT

router.post('/create-announcement', async (request, response) => {
    const instructorId = request.session.userId;
    const courseId = request.body.courseId;
    const title = request.body.title;
    const message = request.body.message;
    await createAnnouncement(instructorId, courseId, title, message);
    response.redirect("/instructor/announcements");

})


module.exports = router;
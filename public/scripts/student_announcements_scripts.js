console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession);

let userId;

let instructorCoursesArray; //array of instructor courses

//get studentId
async function getSession() {
    const response = await fetch('/api/student/session');
    const session = await response.json();
    userId = session.userId;
    // Display student info
    document.getElementById('username').textContent = session.firstName + " " + session.lastName;
    document.querySelector('.student-id').textContent = "ID: " + session.userId;
    await loadCourses();
   
}
async function loadCourses() {
    //GET ALL COURSES FOR STUDENT AND ADD THEM TO THE ARRAY
    
    studentCoursesArray = [];
    const response = await fetch(`/api/student/get-courses/${userId}`);
    const coursesOfStudent = await response.json(); //array of student courses from `student_courses`
    //iterate over each course
    await Promise.all(coursesOfStudent.map(async (value, index, array) => {
        //FIX THIS - DATABASE HAS BEEN UPDATED - USE COURSE ID TO GET COURSES!!!!!!!!
        const courseId = value.courseId;
        const url = `/api/student/get-course-from-courseId/${courseId}`;
        const response = await fetch(url);
        const [course] = await response.json(); //course from courses table
        studentCoursesArray.push(course);
        //insert data into html elements
        await createCourseAnnouncementCard(course, index);
    }))
}

async function createCourseAnnouncementCard(course, index) {
    const announcementsArea = document.getElementById("announcements-sub-area");
    announcementsArea.innerHTML += `<div class="announcements-of-one-course-card">
                                        <div class="announcement-card-course-title">
                                            <div class="announcement-card-course-title-row">
                                                <div class="announcement-card-code-section" >${course.code} - ${course.section}</div>
                                                
                                        </div>
                                        <div class="announcement-card-course-title-row">
                                            <div class="announcement-course-title">${course.title}</div>
                                        </div>
                                    </div>
                                    <div class="announcement-card-body" id = "announcement-body-${index}"></div>
                                    `;
    loadCourseAnnouncements(course.courseId, index);
}

async function loadCourseAnnouncements(courseId, courseNumber) {
    const response = await fetch(`/api/student/get-announcements-of-course/${courseId}`);
    const announcements = await response.json();
    const announcementsBody = document.getElementById(`announcement-body-${courseNumber}`);
    console.log("announcements:", announcements);

    if (announcements.length == 0) {
        announcementsBody.innerHTML = `<div class="announcement">
                                            <div class="announcement-basic-info-row">
                                                <div class="announcement-basic-info">No announcements</div>
                                                <div class="toggle-announcement-display-container"></div>
                                            </div>
                                            <div class="announcement-text-body">
                                            </div>
                                        </div>`;
    }
    else {
        for (const announcement of announcements) {
            const title = announcement.title;
            const date = announcement.dateCreated;
            const formattedDate = (new Date(date)).toLocaleDateString('en-GB', { timeZone: 'UTC' });
            const message = announcement.message;
            announcementsBody.innerHTML += `<div class="announcement">
                                                <div class="announcement-basic-info-row">
                                                    <div class="announcement-basic-info">${title} - ${formattedDate}</div>
                                                    <div class="toggle-announcement-display-container"><label><img src = "/black-icons/icons8-dropdown-50.png"><input type="checkbox" class="toggle-announcement-display"></label></div>
                                                </div>
                                                <div class="announcement-text-body hide">${message}
                                                </div>
                                            </div>`
        }
    }


}

document.addEventListener('change', (event) => {
    if (event.target.classList.contains('toggle-announcement-display')) {
        const announcement = event.target.closest('.announcement');
        const announcementBody = announcement.querySelector(".announcement-text-body");
        
        if (event.target.checked) {
            event.target.previousElementSibling.setAttribute('src', "/black-icons/icons8-collapse-arrow-50.png");
            announcementBody.classList.remove("hide");
        } else {
            announcementBody.classList.add("hide");
            event.target.previousElementSibling.setAttribute('src', "/black-icons/icons8-dropdown-50.png");
        }
    }
});

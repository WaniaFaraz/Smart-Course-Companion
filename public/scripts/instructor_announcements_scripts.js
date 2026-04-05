console.log('scripts loaded');
document.addEventListener('DOMContentLoaded', getSession);




let userId;

let instructorCoursesArray; //array of instructor courses

//get instructorId
async function getSession() {
    const response = await fetch("/api/instructor/session");
    const session = await response.json();
    if (!session) {
        window.location.href = "/instructor/sign-in";
    }
    userId = session.userId;

    // Display instructor info FIRST
    const response2 = await fetch(`/api/instructor/get-instructors/${userId}`);
    const instructor = await response2.json();
    if (instructor && instructor[0]) {
        const firstName = instructor[0].firstName;
        const lastName = instructor[0].lastName;
        const initials = firstName[0] + '.' + lastName[0];
        document.querySelector('.center-title').textContent = `WELCOME PROF. ${lastName.toUpperCase()}`;
        const courseResponse = await fetch(`/api/instructor/get-courses/${userId}`);
        const courses = await courseResponse.json();
        document.querySelector('.current-course-count').textContent = `YOU'RE CURRENTLY MANAGING ${courses.length} COURSES`;
        document.getElementById('username').textContent = initials;
        document.querySelector('.instructor-id').textContent = userId;
    }

    await loadMainPage();
}

async function loadMainPage() {
    instructorCoursesArray = [];
    const instructorId = userId;
    const response = await fetch(`/api/instructor/get-courses/${instructorId}`);
    const instructorCourses = await response.json(); //JSON: instructorId and courseId
    await Promise.all(instructorCourses.map(async (value, index, array) => {
        //get courses from courseIds
        const courseId = value.courseId;
        const response = await fetch(`/api/instructor/get-course-from-id/${courseId}`);
        const [course] = await response.json();
        console.log("course:", course);
        //get course info from JSON object
        instructorCoursesArray.push(course); //add to array of courses
        await createCourseAnnouncementCard(course, index); //index acts like course number
    })
    )
}

async function createCourseAnnouncementCard(course, index) {
    const announcementsArea = document.getElementById("announcements-area");
    announcementsArea.innerHTML += `<div class="announcements-of-one-course-card">
                                        <div class="announcement-card-course-title">
                                            <div class="announcement-card-course-title-row">
                                                <div class="announcement-card-code-section" >${course.code} - ${course.section}</div>
                                                <div class="announcement-card-button-div"><button class = "create-announcement-button" value = ${course.courseId}>NEW<img
                                                    src="/black-icons/black-plus-24.png"></button>
                                            </div>
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
    const response = await fetch(`/api/instructor/get-announcements-of-course/${courseId}`);
    const announcements = await response.json();
    const announcementsBody = document.getElementById(`announcement-body-${courseNumber}`);
    console.log("announcements:",announcements);

    if(announcements.length == 0) {
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

const createAnnouncementButtons = document.getElementsByClassName("create-announcement-button");
for (const createAnnouncementButton of createAnnouncementButtons) {
    createAnnouncementButton.addEventListener("click", createAnnouncement)
}

async function createAnnouncement() {
    const createAnnouncementModal = document.getElementById("create-announcement-modal");
    createAnnouncementModal.showModal();
}


document.addEventListener('change', async (event) => {
    if (event.target.classList.contains('toggle-announcement-display')) {
        if(event.target.checked) {
            const announcement = await event.target.closest('.announcement');
            const announcementBody = await announcement.querySelector(".announcement-text-body");
            event.target.previousElementSibling.setAttribute('src', "/black-icons/icons8-collapse-arrow-50.png");
            announcementBody.classList.remove("hide");
            
        }
        else if(!event.target.checked) {
            const announcement = await event.target.closest(".announcement");
            const announcementBody = await announcement.querySelector(".announcement-text-body");
            announcementBody.classList.add("hide");
            event.target.previousElementSibling.setAttribute('src', "/black-icons/icons8-dropdown-50.png");
        }
        
    }
});


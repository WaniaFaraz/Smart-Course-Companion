//==============================================================================================================
//INSTRUCTIONS FOR SERVER AND WEBSITE ACCESS:
//For visual studio code:
//Open terminal and write: "node server.js" (without the quotes)
//After any modifications to the file, you will have to kill the server (CTRL + C)
//     and restart it, and then refresh the web page to see changes
//Open a browser (chrome, edge, etc...) and type one of the following urls:
// localhost:8080/student/home      <---- leads to the student home page
// localhost:8080/instructor/home   <---- leads to the instructor home page
//to navigate between webpages, can change the url or click on whatever needs to be accessed
//for possible url names, see files "student.routes.js" or "instructor.routes.js"
//==============================================================================================================

//imports and variables
require('.dotenv').config;
const express = require("express");
const { createServer } = require("node:http");
const app = express();
const dir = __dirname;
const session = require("express-session");
const PORT = process.env.PORT || 8080;

// CSP - must be first
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval';"
        + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com;" //so that google fonts works
    );


    
    next();
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session setup - before routes so that it is created/used everytime
app.use(session({
    secret: "soen287_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //1 day
}));

// static files
app.use(express.static('public'));

//all routes -- leads to routes file
app.use("/student", require("./routes/student.routes"));
app.use("/instructor", require("./routes/instructor.routes"));

//leads to controller files
app.use("/api/student", require("./controllers/student.controller"));
app.use("/api/instructor", require("./controllers/instructor.controller"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
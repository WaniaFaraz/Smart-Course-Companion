//==============================================================================================================
//INSTRUCTIONS FOR SERVER AND WEBSITE ACCESS:
//For visual studio code:
//Open terminal and write: "node server.js" (without the quotes)
//After any modifications to the file, you will have to kill the server (CTRL + C)
//     and restart it, and then refresh the web page to see changes
//Open a browser (chrome, edge, etc...) and type one of the following urls:
// localhost:8000/student/home      <---- leads to the student home page
// localhost:8000/instructor/home   <---- leads to the instructor home page
//to navigate between webpages, can change the url or click on whatever needs to be accessed
//for possible url names, see files "student.routes.js" or "instructor.routes.js"
//==============================================================================================================



//imports and variables
const express = require("express");
const { createServer } = require("node:http");
const app = express();
const dir = __dirname;
const session = require("express-session");

const PORT = 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//all routes -- leads to routes file
app.use(express.static('public'));
app.use("/student", require("./routes/student.routes"));
app.use("/instructor", require("./routes/instructor.routes"));
//leads to controller files
app.use("/api/student", require("./controllers/student.controller"));
app.use("/api/instructor", require("./controllers/instructor.controller"))

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

// session setup
app.use(session({
    secret: "soen287_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));





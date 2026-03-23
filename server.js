const express = require("express");
const { createServer } = require("node:http");
const app = express();
const dir = __dirname;

const PORT = 8000;

//all routes -- leads to routes file
app.use(express.static('public'));
app.use("/student", require("./student.routes"));
app.use("/instructor", require("./instructor.routes"))

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

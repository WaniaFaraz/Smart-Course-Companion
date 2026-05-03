const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "lms_info" //name of the database
}).promise() //use pool whenever accessing the database

module.exports = pool;
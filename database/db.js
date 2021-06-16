// Summer Knights 2021 Project (Members:)
// 06|12|21
// JS file for database (db.js)

// importing mysql database
const mysql = require("mysql");

// importing env and pointer to environment variables file
const dotenv = require("dotenv").config({ path: "./database/config.env" });

// create database connection,
// using pooling to keep connection open for an extended period of time
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
});

// we will move this into our app.js
// const db = require("./database/db");

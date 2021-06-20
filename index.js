// Finance App
// main js file (index.js)

// include env
require("dotenv").config({ path: "./database/config.env" });

// import express
const express = require("express");
// start express
const app = express();

// import cookie parser
const cookieParser = require("cookie-parser");

// include body parser
const bodyParser = require("body-parser");
// user json for parser
app.unsubscribe(bodyParser.json());

// connecting to port
const PORT = process.env.PORT || 5000;
const exphbs = require("express-handlebars");

// handlebars middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// importing db file from database folder
// const db = require("db.js").config({ path: "./database/db.js" });
// temp db connection..need to connect to db.js
const mysql = require("mysql");
const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
});

// import web tokens
const jwt = require("jsonwebtoken");
// import encryption
const bcrypt = require("bcryptjs");

// parse html - grab data from forms
app.use(express.urlencoded({ extended: false }));
// data as json
app.use(express.json());

// get landing page
app.get("/", (req, res) => {
  res.render("home_page");
});

// get home page
app.get("/home_page", (req, res) => {
  res.render("home_page");
});

// get login page
app.get("/login_page", (req, res) => {
  res.render("login_page");
});

// get register page
app.get("/register_page", (req, res) => {
  res.render("register_page");
});

// post home page
app.post("/home_page");

// register page
app.post("/register_page", async (req, res) => {
  console.log(req.body);
  try {
    const { username, email, password, confirm_password } = req.body;
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log("user register error 1");
        }
        if (results.length > 0) {
          return res.render("register_page", {
            register_error_message: "email already in use",
          });
        } else if (password !== confirm_password) {
          return res.render("register_page", {
            register_error_message: "passwords do not match",
          });
        }

        // encrypt the user password
        let encrypted_password = await bcrypt.hash(password, 8);

        // insert users stuff into db
        db.query(
          "INSERT INTO users SET ?",
          {
            username: username,
            email: email,
            password: encrypted_password,
          },
          (error, results) => {
            if (error) {
              console.log("db insertion error");
            } else {
              // good status in js 200
              res.status(200).redirect("/login_page");
            }
          }
        );
      }
    );
  } catch (error) {
    console.log("user register error 2");
  }
});

// listening on PORT
app.listen(PORT, () => console.log("Server Started: ", PORT));

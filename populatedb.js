#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Homework = require("./models/homework");
var Course = require("./models/course");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var homeworks = [];
var courses = [];

//  course constructor
function courseCreate(name, department, code, description, cb) {
  courseDetail = {
    name: name,
    department: department,
    code: code,
    description: description,
  };

  var course = new Course(courseDetail);
  course.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New course: " + course);
    courses.push(course);
    cb(null, course);
  });
}

//  homework constructor
function homeworkCreate(name, description, course, due, cb) {
  homeworkdetail = {
    name: name,
    description: description,

    due: due,
  };
  if (course != false) homeworkdetail.course = course;

  var homework = new Homework(homeworkdetail);
  homework.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New homework: " + homework);
    homeworks.push(homework);
    cb(null, homework);
  });
}

function createCourses(cb) {
  async.parallel(
    [
      function (callback) {
        courseCreate(
          "Probability and Statistics",
          "Math",
          327,
          false,
          callback
        );
      },
      function (callback) {
        courseCreate(
          "Advanced Computer Architecture",
          "CS",
          320,
          false,
          callback
        );
      },
      function (callback) {
        courseCreate("Design Patterns", "CS", 432, false, callback);
      },
      function (callback) {
        courseCreate("Database Systems", "CS", 442, false, callback);
      },
    ],
    // optional callback
    cb
  );
}

function createHomeworks(cb) {
  async.parallel(
    [
      function (callback) {
        homeworkCreate(
          "Homework 1",
          "Prove Demorgans theorem",
          courses[0],
          "2023-02-16",
          callback
        );
      },
      function (callback) {
        homeworkCreate(
          "Homework 1",
          "blah blah sample 320 problem",
          courses[1],
          "2023-02-14",
          callback
        );
      },
      function (callback) {
        homeworkCreate(
          "Homework 1",
          "Write a paragraph expalining Object Oriented Programming",
          courses[2],
          "2023-02-10",
          callback
        );
      },
      function (callback) {
        homeworkCreate(
          "Homework 1",
          "Construct an ER diagram based on the example we discussed in class today",
          courses[3],
          "2023-02-21",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCourses, createHomeworks],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Homeworks: " + homeworks);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

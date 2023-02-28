const Course = require("../models/course");
const Homework = require("../models/homework");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.sidebar = function (req, res, next) {
  Course.find({}, "").exec(function (err, list_course) {
    if (err) {
      return next(err);
    }
    res.locals.sidebardata = {
      title: "Courses",
      courses: list_course,
    };
    next();
  });
};

exports.index = function (req, res, next) {
  res.render("index");
};

exports.course_list = function (req, res, next) {
  res.render("course list");
};

exports.course_detail = function (req, res, next) {
  async.parallel(
    {
      course(callback) {
        Course.findById(req.params.id).exec(callback);
      },
      coursehomeworks(callback) {
        Homework.find({ course: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.course == null) {
        const err = new Error("Course not found");
        err.status = 404;
        return next(err);
      }
      res.render("course_detail", {
        course: results.course,
        homeworks: results.coursehomeworks,
      });
    }
  );
};

exports.course_create_get = function (req, res, next) {
  res.render("course_form");
};

exports.course_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify course name"),
  body("department")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify department name")
    .isAlphanumeric()
    .withMessage("Department must contain only alphanumeric characters"),
  body("code")
    .isInt({ min: 100, max: 800 })
    .escape()
    .withMessage("Course number must be between 100 and 999"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("course_form", { course: req.body, errors: errors.array() });
      return;
    }
    const course = new Course({
      name: req.body.name,
      department: req.body.department,
      code: req.body.code,
      department: req.body.department,
    });
    course.save((err) => {
      if (err) {
        return next(err);
      }
      res.locals.sidebardata.courses.push(course);
      res.redirect(course.url);
    });
  },
];

exports.course_delete_get = function (req, res, next) {
  async.parallel(
    {
      course(callback) {
        Course.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("course_delete", {
        title: "Delete course",
        course: results.course,
      });
    }
  );
};

exports.course_delete_post = function (req, res, next) {
  console.log(req.body.courseid);
  Course.findByIdAndRemove(req.body.courseid, (err) => {
    if (err) {
      return next(err);
    }
    //  W
    res.redirect("/");
  });
};

exports.course_update_get = function (req, res, next) {
  res.send("course update get");
};

exports.course_update_post = function (req, res, next) {
  res.send("course update post");
};

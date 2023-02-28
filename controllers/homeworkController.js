const Course = require("../models/course");
const Homework = require("../models/homework");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.homework_list = function (req, res, next) {
  res.send("homework list");
};

exports.homework_detail = function (req, res, next) {
  res.send("homework detail");
};

exports.homework_create_get = function (req, res, next) {
  async.parallel(
    {
      courses(callback) {
        Course.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("homework_form", {
        title: "New Homework",
        courses: results.courses,
      });
    }
  );
};

exports.homework_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify course name")
    .isLength({ max: 100 })
    .escape()
    .withMessage("Course name too long"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify department name")
    .isLength({ max: 500 })
    .escape()
    .withMessage("Course name too long")
    .isAlphanumeric()
    .withMessage("Department must contain only alphanumeric characters"),
  body("due", "Invalid Date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("course").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("homework_form", { course: req.body, errors: errors.array() });
      return;
    }
    const homework = new Homework({
      name: req.body.name,
      description: req.body.description,
      course: req.body.course,
      due: req.body.due,
    });
    homework.save((err) => {
      if (err) {
        return next(err);
      }
      console.log(req.body.course);
      console.log(req.body.name);
      res.redirect(`../course/${req.body.course}`);
    });
  },
];

exports.homework_delete_get = function (req, res, next) {
  res.send("homework delete get");
};

exports.homework_delete_post = function (req, res, next) {
  res.send("homework delete post");
};

exports.homework_update_get = function (req, res, next) {
  res.send("homework update get");
};

exports.homework_update_post = function (req, res, next) {
  res.send("homework update post");
};

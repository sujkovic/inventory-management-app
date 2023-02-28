var express = require("express");
var router = express.Router();

const homework_controller = require("../controllers/homeworkController");
const course_controller = require("../controllers/courseController");

//  home page
router.get("/", course_controller.index);

//            Course Routes              //

router.get("/courses", course_controller.course_list);
router.get("/course/create", course_controller.course_create_get);
router.post("/course/create", course_controller.course_create_post);
router.get("/homework/create", homework_controller.homework_create_get);
router.post("/homework/create", homework_controller.homework_create_post);
router.get("/course/:id", course_controller.course_detail);
//  Bruh big issue i had was course/create has to come before course/id or it breaks
router.get("/course/:id/delete", course_controller.course_delete_get);
router.post("/course/:id/delete", course_controller.course_delete_post);
router.get("/course/:id/update", course_controller.course_update_get);
router.post("/course/:id/update", course_controller.course_update_post);

//            Homework Routes              //

router.get("/homework/:id/delete", homework_controller.homework_delete_get);
router.post("/homework/:id/delete", homework_controller.homework_delete_post);
router.get("/homework/:id/update", homework_controller.homework_update_get);
router.post("/homework/:id/update", homework_controller.homework_update_post);

module.exports = router;

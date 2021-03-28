const express = require("express");
const { protect,authorize } = require("../middleware/auth");

const {
  getCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../model/Course");
const advancedResult = require("../middleware/advancedResult");
const advancedResults = require("../middleware/advancedResult");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect,authorize('publisher','admin'), addCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(protect,authorize('publisher','admin'), updateCourse)
  .delete(protect, authorize('publisher','admin'),deleteCourse);

module.exports = router;

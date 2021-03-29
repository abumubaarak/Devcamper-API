const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const {
  getReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviews");

const Reviews = require("../model/Reviews");
const advancedResults = require("../middleware/advancedResult");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Reviews, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);
module.exports = router;

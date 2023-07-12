const express = require("express");
const router = express.Router();

//Require controller module
const controller = require('../controllers/reviews')

//GET /reviews/
router.get("/", controller.getReviews);

//GET /reviews/meta

router.get("/meta", controller.getMeta);

// POST /reviews
router.post("/", controller.postReview);

// PUT /reviews/:review_id/helpful
router.put("/:review_id/helpful", controller.putHelpful);

// PUT /reviews/:review_id/report
router.put("/:review_id/report", controller.putReport);

module.exports = router;
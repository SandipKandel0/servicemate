const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.use(protect);
router.route("/").get(asyncHandler(getServices)).post(asyncHandler(createService));
router
  .route("/:id")
  .get(asyncHandler(getService))
  .put(asyncHandler(updateService))
  .delete(asyncHandler(deleteService));

module.exports = router;

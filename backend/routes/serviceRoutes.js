const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  uploadServiceBill,
} = require("../controllers/serviceController");

router.use(protect);
router.route("/").get(asyncHandler(getServices)).post(asyncHandler(createService));
router
  .route("/:id")
  .get(asyncHandler(getService))
  .put(asyncHandler(updateService))
  .delete(asyncHandler(deleteService));
router.post("/:id/bill", upload.single("bill"), asyncHandler(uploadServiceBill));

module.exports = router;

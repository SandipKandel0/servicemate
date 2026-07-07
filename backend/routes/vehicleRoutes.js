const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { protect } = require("../middleware/auth");
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router.use(protect);
router.route("/").get(asyncHandler(getVehicles)).post(asyncHandler(createVehicle));
router
  .route("/:id")
  .get(asyncHandler(getVehicle))
  .put(asyncHandler(updateVehicle))
  .delete(asyncHandler(deleteVehicle));

module.exports = router;

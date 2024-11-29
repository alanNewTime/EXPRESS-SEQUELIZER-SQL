const Router = require("express");
const router = Router();

const cors = require("cors");
router.use(cors());

const cylinderController = require("../controllers/cylinderController");

router.post("/api/cylinders", cylinderController.addCylinder);

router.get("/api/cylinders", cylinderController.getAllCylinders);
router.get("/api/cylinders/:id", cylinderController.getSingleCylinder);

router.put("/api/cylinders/:id", cylinderController.updateCylinder);

router.delete("/api/cylinders/:id", cylinderController.deleteCylinder);

module.exports = router;

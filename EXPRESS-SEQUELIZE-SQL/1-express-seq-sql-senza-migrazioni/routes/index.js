const Router = require("express");
const router = Router();

const cylinderRouter = require("./cylinders");

router.use(cylinderRouter);

module.exports = router;

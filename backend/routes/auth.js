const router = require("express").Router();
const { AuthController } = require("../controllers");

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.logIn);

module.exports = router;

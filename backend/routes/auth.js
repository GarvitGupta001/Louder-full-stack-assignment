const router = require("express").Router();
const { AuthController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.logIn);
router.get("/me", AuthMiddleware.verifyToken, AuthController.fetchUser);

module.exports = router;

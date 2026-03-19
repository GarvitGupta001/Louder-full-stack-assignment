const router = require("express").Router();
const { RequestController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

router.post(
    "/ai-search",
    AuthMiddleware.verifyToken,
    RequestController.AIsearch,
);

module.exports = router;

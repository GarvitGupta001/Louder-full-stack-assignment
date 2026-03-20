const router = require("express").Router();
const { RequestController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

router.post(
    "/ai-search",
    AuthMiddleware.verifyToken,
    RequestController.AIsearch,
);

router.get(
    "/history",
    AuthMiddleware.verifyToken,
    RequestController.getRequestHistory,
);

router.get(
    "/:requestId",
    AuthMiddleware.verifyToken,
    RequestController.getRequestById,
);

router.delete(
    "/:requestId",
    AuthMiddleware.verifyToken,
    RequestController.deleteRequest,
);

module.exports = router;

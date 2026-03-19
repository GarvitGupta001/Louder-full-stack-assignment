const { jwtVerify } = require("../utils/jwt");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwtVerify(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = {
    verifyToken,
};

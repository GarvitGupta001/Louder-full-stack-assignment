const jwt = require("jsonwebtoken");

const jwtSign = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Error signing JWT: " + error.message);
    }
};

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Error verifying JWT: " + error.message);
    }
};

module.exports = {
    jwtSign,
    jwtVerify,
};
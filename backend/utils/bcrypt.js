const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password: " + error.message);
    }
};

const comparePassword = async (password, hash) => {
    try {
        return await bcryptjs.compare(password, hash);
    } catch (error) {
        throw new Error("Error comparing password: " + error.message);
    }
};

module.exports = {
    hashPassword,
    comparePassword,
};
const { UserService } = require("../services");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cleanIndexes } = require("../models/user");

const signUp = async (req, res) => {
    try {
        const userData = req.body;
        if (!userData.name || !userData.email || !userData.password) {
            return res.status(400).json({
                success: false,
                code: "MISSING_FIELDS",
                message: "Missing required fields",
            });
        }

        userData.passwordHash = await hashPassword(userData.password);
        delete userData.password;

        console.log("Creating user with data:", userData);

        const user = await UserService.createUser(userData);

        if (!user) {
            return res.status(500).json({
                success: false,
                code: "INTERNAL_SERVER_ERROR",
                message: "Error creating user",
            });
        }

        const { passwordHash, __v, ...cleanUser } = user.toObject();

        res.status(201).json({
            success: true,
            code: "USER_CREATED",
            message: "User created successfully",
            data: cleanUser,
        });
    } catch (error) {
        if (error.message === "EXISTING_USER") {
            return res.status(409).json({
                success: false,
                code: "EXISTING_USER",
                message: "User already exists",
            });
        }
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
};

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                code: "MISSING_FIELDS",
                message: "Missing required fields",
            });
        }

        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await comparePassword(
            password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password",
            });
        }

        const token = jwtSign({ userId: user._id });
        res.status(200).json({
            success: true,
            code: "LOGIN_SUCCESS",
            message: "Login successful",
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
};

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

const jwtSign = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Error signing JWT: " + error.message);
    }
};

module.exports = {
    signUp,
    logIn,
};
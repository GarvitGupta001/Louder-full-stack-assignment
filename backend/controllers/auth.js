const { UserService } = require("../services");
const { jwtSign } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/bcrypt");

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
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
};

const fetchUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User not found",
            });
        }

        const { passwordHash, __v, ...cleanUser } = user.toObject();

        res.status(200).json({
            success: true,
            code: "USER_FETCH_SUCCESS",
            message: "User data retrieved successfully",
            data: cleanUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
};

module.exports = {
    signUp,
    logIn,
    fetchUser,
};

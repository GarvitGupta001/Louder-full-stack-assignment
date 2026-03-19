const { UserModel } = require("../models");

const createUser = async (userData) => {
    try {
        const user = new UserModel(userData);
        await user.save();
        return user;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("EXISTING_USER");
        }
        throw new Error("Error creating user: " + error.message);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({ email });
        return user;
    } catch (error) {
        throw new Error("Error fetching user: " + error.message);
    }
};

const getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        throw new Error("Error fetching user: " + error.message);
    }
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
};

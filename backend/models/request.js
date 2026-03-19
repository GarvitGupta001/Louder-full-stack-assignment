const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        extractedInfo: {
            type: Object,
        },
        response: {
            venue_name: String,
            location: String,
            estimated_cost: String,
            justification: String,
        },
    },
    { timestamps: true },
);

const RequestModel = mongoose.model("requests", requestSchema, "requests");

module.exports = RequestModel;

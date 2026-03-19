const { response } = require("../server");
const { RequestService, GeminiService } = require("../services");

const AIsearch = async (req, res) => {
    try {
        const { prompt } = req.body;
        const { userId } = req;

        const requestData = {
            userId,
            prompt,
        };

        const request = await RequestService.createRequest(requestData);

        const extractedInfo = await GeminiService.extractInformation(prompt);
        const searchResults =
            await GeminiService.generateTravelRecommendation(extractedInfo);

        await RequestService.updateRequest(request._id, {
            extractedInfo: JSON.parse(extractedInfo),
            response: searchResults,
        });

        res.status(200).json({
            success: true,
            code: "AI_SEARCH_SUCCESS",
            message: "AI search processed successfully",
            data: searchResults,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: "Error processing AI search",
            error: error.message,
        });
    }
};

module.exports = {
    AIsearch,
};

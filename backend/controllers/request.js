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
            data: { prompt, response: searchResults },
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

const getRequestHistory = async (req, res) => {
    try {
        const { userId } = req;
        const requests = await RequestService.getRequestsByUserId(userId);
        const cleanedRequests = requests.map((req) => ({
            id: req._id,
            prompt: req.prompt,
            createdAt: req.createdAt,
        }));

        res.status(200).json({
            success: true,
            code: "REQUEST_HISTORY_SUCCESS",
            message: "Request history retrieved successfully",
            data: cleanedRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: "Error retrieving request history",
            error: error.message,
        });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await RequestService.getRequestById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                code: "REQUEST_NOT_FOUND",
                message: "Request not found",
            });
        }

        if (request.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "You do not have permission to access this request",
            });
        }

        res.status(200).json({
            success: true,
            code: "REQUEST_DETAIL_SUCCESS",
            message: "Request details retrieved successfully",
            data: {
                id: request._id,
                prompt: request.prompt,
                extractedInfo: request.extractedInfo,
                response: request.response,
                createdAt: request.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: "Error retrieving request details",
            error: error.message,
        });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const Request = await RequestService.getRequestById(requestId);

        if (!Request) {
            return res.status(404).json({
                success: false,
                code: "REQUEST_NOT_FOUND",
                message: "Request not found",
            });
        }

        if (Request.userId.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                code: "FORBIDDEN",
                message: "You do not have permission to delete this request",
            });
        }

        await RequestService.deleteRequest(requestId);

        res.status(200).json({
            success: true,
            code: "REQUEST_DELETE_SUCCESS",
            message: "Request deleted successfully",
            data: { id: requestId },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            code: "INTERNAL_SERVER_ERROR",
            message: "Error deleting request",
            error: error.message,
        });
    }
};

module.exports = {
    AIsearch,
    getRequestHistory,
    getRequestById,
    deleteRequest,
};

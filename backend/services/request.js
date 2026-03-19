const {RequestModel} = require('../models');

const createRequest = async (requestData) => {
    try {
        const request = new RequestModel(requestData);
        await request.save();
        return request;
    } catch (error) {
        throw new Error('Error creating request: ' + error.message);
    }
};

const updateRequest = async (requestId, updateData) => {
    try {
        const request = await RequestModel.findById(requestId);
        if (!request) {
            throw new Error('Request not found');
        }
        Object.assign(request, updateData);
        await request.save();
        return request;
    } catch (error) {
        throw new Error('Error updating request: ' + error.message);
    }
};

const getRequestById = async (requestId) => {
    try {
        const request = await RequestModel.findById(requestId);
        if (!request) {
            throw new Error('Request not found');
        }
        return request;
    } catch (error) {
        throw new Error('Error fetching request: ' + error.message);
    }
};

const getRequestByUserId = async (userId) => {
    try {
        const requests = await RequestModel.find({ userId });
        return requests;
    } catch (error) {
        throw new Error('Error fetching requests: ' + error.message);
    }
};

module.exports = {
    createRequest,
    updateRequest,
    getRequestById,
    getRequestByUserId,
};
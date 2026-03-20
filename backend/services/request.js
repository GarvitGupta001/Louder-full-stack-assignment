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

const getRequestsByUserId = async (userId) => {
    try {
        const requests = await RequestModel.find({ userId }, null, { sort: { createdAt: -1 } });
        return requests;
    } catch (error) {
        throw new Error('Error fetching requests: ' + error.message);
    }
};

const deleteRequest = async (requestId) => {
    try {
        const result = await RequestModel.deleteOne({ _id: requestId });
        if (result.deletedCount === 0) {
            throw new Error('Request not found');
        }
    } catch (error) {
        throw new Error('Error deleting request: ' + error.message);
    }
};

module.exports = {
    createRequest,
    updateRequest,
    getRequestById,
    getRequestsByUserId,
    deleteRequest,
};
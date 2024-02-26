const MongoStorage = require('../data/mongoStorage');

const storage = new MongoStorage('request');

const findRequests = (soldierId) => storage.find({ soldierId });

const retrieveRequest = (id, soldierId) => storage.retrieve({ _id: id }, { soldierId });

const createRequest = (request, soldierId) => storage.create(request, soldierId);

const updateRequest = (id, soldierId, request) => storage.update({ _id: id }, soldierId, request);

const deleteRequest = (request, soldierId) => storage.delete(request, soldierId);

module.exports = {
  findRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

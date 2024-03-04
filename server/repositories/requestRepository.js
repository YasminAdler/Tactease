const MongoStorage = require('../data/mongoStorage');

const storage = new MongoStorage('request');

const findRequests = () => storage.find();

const findSoldierRequests = (soldierId) => storage.findRequests(soldierId);

const retrieveRequest = (id) => storage.retrieve({ _id: id });

const createRequest = (id, request) => storage.updateRequests(id, request);

const updateRequest = (id, request) => storage.update({ _id: id }, request);

const deleteRequest = (request) => storage.delete(request);

module.exports = {
  findRequests, findSoldierRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

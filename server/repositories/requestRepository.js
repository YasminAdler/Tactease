const MongoStorage = require('../data/mongoStorage');

const storage = new MongoStorage('request');

const findRequests = () => storage.find({});

const retrieveRequest = (id) => storage.retrieve({ _id: id });

const createRequest = (request) => storage.create(request);

const updateRequest = (id, request) => storage.update({ _id: id }, request);

const deleteRequest = (request) => storage.delete(request);

module.exports = {
  findRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

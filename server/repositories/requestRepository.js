const MongoStorage = require('../data/mongoStorage');

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
    this.storage = new MongoStorage('request');
}

const findRequests = () => this.storage.find({});

const retrieveRequest = (id) => this.storage.retrieve({ _id: id });

const createRequest = (request) => this.storage.create(request);

const updateRequest = (id, request) => this.storage.update({ _id: id }, request);

const deleteRequest = (request) => this.storage.delete(request);

module.exports = {
    findRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

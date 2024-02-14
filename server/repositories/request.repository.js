const MongoStorage = require('../data/mongoStorage')
const localStorage = require('../data/localStorage')


const mongoStorage = new MongoStorage('reports');

const findRequests = () => mongoStorage.find({});

const retrieveRequest = (id) => mongoStorage.retrieve(id);

const createRequest = (report) => mongoStorage.create(report);

const updateRequest = (id, report) => mongoStorage.update(id, report);

const deleteRequest = (report) => mongoStorage.delete(report);

module.exports = {
    findRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

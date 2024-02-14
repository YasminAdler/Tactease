const MongoStorage = require('../data/mongoStorage')
const localStorage = require('../data/localStorage')


const mongoStorage = new MongoStorage('reports');

const findRequests = () => mongoStorage.find({});

const retrieveRequest = (id) => mongoStorage.retrieve({ _id: id });

const createRequest = (report) => mongoStorage.create(report);

const updateRequest = (id, report) => mongoStorage.update({ _id: id }, report);

const deleteRequest = (report) => mongoStorage.delete({ _id: report });

module.exports = {
    findRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};

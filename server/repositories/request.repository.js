const MongoStorage = require('../data/mongoStorage')
const localStorage = require('../data/localStorage')


const mongoStorage = new MongoStorage('reports');

const findReports = () => mongoStorage.find({});

const retrieveReport = (id) => mongoStorage.retrieve({ _id: id });

const createReport = (report) => mongoStorage.create(report);

const updateReport = (id, report) => mongoStorage.update({ _id: id }, report);

const deleteReport = (report) => mongoStorage.delete({ _id: report });

module.exports = {
    findReports, retrieveReport, createReport, updateReport, deleteReport,
};

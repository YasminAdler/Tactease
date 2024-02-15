const MongoStorage = require('../data/mongoStorage');
// const localStorage = require('../data/localStorage');

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
  this.storage = new MongoStorage('mission');
}

const findMissions = () => this.storage.find();

const retrieveMission = (id) => this.storage.retrieve(id);

const createMission = (mission) => this.storage.create(mission);

const updateMission = (id, mission) => this.storage.update(id, mission);

const deleteMission = (id) => this.storage.delete(id);

module.exports = {
  findMissions, retrieveMission, createMission, updateMission, deleteMission,
};

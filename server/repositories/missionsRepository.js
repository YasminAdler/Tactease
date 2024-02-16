const MongoStorage = require('../data/mongoStorage');

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
  this.storage = new MongoStorage('mission');
}

const findMissions = () => this.storage.find();

const retrieveMission = (id) => this.storage.retrieve({ _id: id });

const createMission = (mission) => this.storage.create(mission);

const updateMission = (id, mission) => this.storage.update({ _id: id }, mission);

const deleteMission = (id) => this.storage.delete({ _id: id });

module.exports = {
  findMissions, retrieveMission, createMission, updateMission, deleteMission,
};

const MongoStorage = require('../data/mongoStorage');

const mongoStorage = new MongoStorage('mission');
const findMissions = () => mongoStorage.find({});

const retrieveMission = (id) => mongoStorage.retrieve({ _id: id });

const createMission = (mission) => mongoStorage.create(mission);

const createMissions = (missions) => mongoStorage.createMany(missions);

const updateMission = (id, mission) => mongoStorage.update({ _id: id }, mission);

const deleteMission = (id) => mongoStorage.delete({ _id: id });

module.exports = {
  findMissions, retrieveMission, createMission, createMissions, updateMission, deleteMission,
};

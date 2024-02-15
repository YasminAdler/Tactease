const MongoStorage = require('../data/mongoStorage')
const localStorage = require('../data/localStorage')


    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS){
    this.storage = new MongoStorage('mission')}

   const findMissions  = () => {
    return this.storage.find()
   }

   const retrieveMission = (id) => {
    return this.storage.retrieve(id)
   }

   const createMission = (mission) => {
    return this.storage.create(mission)
   }

   const updateMission = (id, mission) => {
    return this.storage.update(id,mission)
   }

   const deleteMission = (id) => {
    return this.storage.delete(id)
   }
// }

module.exports = { findMissions, retrieveMission, createMission, updateMission, deleteMission };

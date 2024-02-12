const missionRepository = require('../repositories/missionRepository');
const missions = new missionRepository()
let counter = 1
exports.missionsController = {
    async getMissions (req,res){
        const result = {
            status: 200,
            message: '',
            data: await missions.find()
        }
        res.status(result.status)
        res.json(result.message || result.data)
    },
    async getMissionByID (req,res){
        const { id } = req.params
        const result = {
            status: 200,
            message: '',
            data: await missions.retrieve(id)
        }
        res.status(result.status)
        res.json(result.message || result.data)
    },
    async addMission (req, res){
        const mission = req.body
        mission.id = ++counter
        const result = {
            status: 201,
            message: '',
            data: await missions.create(mission)
        }
        res.status(result.status)
        res.json(result.message || result.data)
    },
    async updateMission (req,res) {
        const { body: mission , params: { id } } = req
        const result = {
            status: 200,
            message: '',
            data: await missions.update(id, mission)
        } 
        res.status(result.status)
        res.json(result.message || result.data)
    },
    async deleteMission (req,res){
        const { id } = req.params
        const result = {
            status: 200,
            message: '',
            data: await missions.delete(id)
        } 
        res.status(result.status)
        res.json(result.message || result.data)
    }
}
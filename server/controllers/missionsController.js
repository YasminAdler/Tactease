const missionRepository = require('../repositories/missionsRepository');
const missions = new missionRepository()
let counter = 5
exports.missionsController = {
    async getMissions (req,res){
        try{
            const result = {
                status: 200,
                message: '',
                data: await missions.find()
            }
            if (result.data.length === 0 || !result.data) throw new EntityNotFoundError('missions')
            res.status(result.status)
            res.json(result.message || result.data)
        }catch(error){
            res.status(error?.status || 500)
            res.json({ message: error.message })
        }
    },
    async getMissionByID (req,res){
        try{
            const { id } = req.params
            if (id === ':id') throw new PropertyNotFoundError('id')
            const result = {
                status: 200,
                message: '',
                data: await missions.retrieve(id)
            }
            if (result.data.length === 0 || !result.data) throw new EntityNotFoundError('mission')
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            res.status(error?.status || 500)
            res.json({ message: error.message })
        }
    },
    async addMission (req, res){
        try{
            const mission = req.body
            if (mission.length === 0) throw new PropertyNotFoundError('mission')
            mission.id = ++counter
            const result = {
                status: 201,
                message: '',
                data: await missions.create(mission)
            }
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            res.status(error?.status || 500)
            res.json({ message: error.message })
        }
    },
    async updateMission (req,res) {
        try{
            const { body: mission , params: { id } } = req
            if (mission.length === 0) throw new PropertyNotFoundError('mission')
            if (id === ':id') throw new PropertyNotFoundError('id')
            const result = {
                status: 200,
                message: '',
                data: await missions.update(id, mission)
            } 
            if (!result.data) throw new Error('Error updating mission')
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            res.status(error?.status || 500)
            res.json({ message: error.message })
        }
    },
    async deleteMission (req,res){
        try{
            const { id } = req.params
            if (id === ':id') throw new PropertyNotFoundError('id')
            const result = {
                status: 200,
                message: '',
                data: await missions.delete(id)
            } 
            if (!result.data) throw new Error('Error deleting mission')
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            res.status(error?.status || 500)
            res.json({ message: error.message })
        }
    }
}
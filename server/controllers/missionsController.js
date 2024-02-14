const {
    findMissions,
    retrieveMission,
    createMission,
    updateMission,
    deleteMission
} = require('../repositories/missionsRepository');
const { EntityNotFoundError, PropertyNotFoundError } = require('../errors/errors')
const mongoose = require('mongoose');
// const missions = new missionRepository()
// let counter = 5
exports.missionsController = {
    async getMissions (req, res, next){
        try{
            const result = {
                status: 200,
                message: '',
                data: await findMissions()
            }
            if (result.data.length === 0 || !result.data) throw new EntityNotFoundError('missions')
            res.status(result.status)
            res.json(result.message || result.data)
        }catch(error){
            // res.status(error?.status || 500)
            // res.json({ message: error.message })
            next(error)
        }
    },
    async getMissionByID (req, res, next){
        try{
            const { missionId } = req.params
            const isId = mongoose.isValidObjectId(missionId);
            if (!isId) throw new PropertyNotFoundError('id');
            // if (id === ':id') throw new PropertyNotFoundError('id')
            const result = {
                status: 200,
                message: '',
                data: await retrieveMission(id)
            }
            if (result.data.length === 0 || !result.data) throw new EntityNotFoundError(`Request with id <${missionId}>`)
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            // res.status(error?.status || 500)
            // res.json({ message: error.message })
            next(error)
        }
    },
    async addMission (req, res, next){
        try{
            if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
            // const mission = req.body
            const { missionType , startDate , endDate , soldierCount } = req.body
            // if (mission.length === 0) throw new PropertyNotFoundError('mission')
            if (!missionType || !startDate || !endDate || !soldierCount) throw new PropertyNotFoundError('mission - missing arguments')
            // mission.missionId = ++counter
            const result = {
                status: 201,
                message: '',
                data: await createMission(req.body)
            }
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {

            if (error.name === 'ValidationError') {
                error.status = 400;
            }
            // res.status(error?.status || 500)
            // res.json({ message: error.message })
            next(error)
        }
    },
    async updateMission (req, res, next){
        try{
            const { missionId } = req.params;
            const isId = mongoose.isValidObjectId(missionId);
            if (!isId) throw new BadRequestError('id');
            if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
            // const { body: mission , params: { id } } = req
            if (mission.length === 0) throw new PropertyNotFoundError('mission')
            if (id === ':id') throw new PropertyNotFoundError('id')
            const result = {
                status: 200,
                message: '',
                data: await updateMission(missionId,req.body)
            } 
            if (!result.data || result.data.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`)
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {
            // res.status(error?.status || 500)
            // res.json({ message: error.message })
            next(error)
        }
    },
    async deleteMission (req, res, next){
        try{
            const { missionId } = req.params
            // if (id === ':id') throw new PropertyNotFoundError('id')
            const isId = mongoose.isValidObjectId(missionId);
            if (!isId) throw new BadRequestError('id');
            const result = {
                status: 200,
                message: '',
                data: await deleteMission(id)
            } 
            if (!result.data || result.data.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`)
            res.status(result.status)
            res.json(result.message || result.data)
        } catch (error) {

            if (error.name === 'ValidationError') {
                 error.status = 400;
            }
            // res.status(error?.status || 500)
            // res.json({ message: error.message })
            next(error)
        }
    }
}

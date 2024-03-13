const { Router } = require('express')
const { missionsController } = require('../controllers/missionsController')
const missionsRouter = new Router()

missionsRouter.get('/', missionsController.getMissions)
missionsRouter.get('/:id', missionsController.getMissionByID)
missionsRouter.post('/', missionsController.addMission)
missionsRouter.put('/:id', missionsController.updateMission)
missionsRouter.delete('/:id', missionsController.deleteMission)

module.exports = { missionsRouter }
const { Router } = require('express');
const { missionsController } = require('../controllers/missionsController');

const missionsRouter = new Router();

missionsRouter.get('/', missionsController.getMissions);
missionsRouter.get('/:missionId', missionsController.getMissionByID);
missionsRouter.post('/', missionsController.addMission);
missionsRouter.put('/:missionId', missionsController.updateMission);
missionsRouter.delete('/:missionId', missionsController.deleteMission);

module.exports = { missionsRouter };

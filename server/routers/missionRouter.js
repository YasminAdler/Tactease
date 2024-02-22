const { Router } = require('express');
const { missionsController } = require('../controllers/missionsController');
const { algorithmController } = require('../middlewares/algorithm');

const missionsRouter = new Router();

missionsRouter.get('/', missionsController.getMissions);
missionsRouter.get('/:missionId', missionsController.getMissionByID);
missionsRouter.post('/', algorithmController.executeAlgorithm);
missionsRouter.put('/:missionId', missionsController.updateMission);
missionsRouter.delete('/:missionId', missionsController.deleteMission);

module.exports = { missionsRouter };

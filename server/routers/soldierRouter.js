const { Router } = require('express');
const { soldiersController } = require('../controllers/soldierController');

const soldierRouter = new Router();
// const { requestsRouter } = require('./requestRouter');

soldierRouter.get('/', soldiersController.getAllSoldiers);
soldierRouter.get('/:soldierId', soldiersController.getSoldierById);
soldierRouter.post('/', soldiersController.createSoldier);
soldierRouter.put('/:soldierId', soldiersController.updateSoldier);
soldierRouter.delete('/:soldierId', soldiersController.deleteSoldier);

// soldierRouter.use('/:soldierId/requests', requestsRouter);

module.exports = { soldierRouter };
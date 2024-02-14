const { Router } = require('express');
const {requestController } = require('../controller/requestController');

const reportsRouter = new Router();

reportsRouter.get('/', reportsController.getAllRequests);
reportsRouter.get('/:requestId', reportsController.getRequestById);
reportsRouter.post('/', reportsController.createReport);
reportsRouter.put('/:requestId', reportsController.updateReport);
reportsRouter.delete('/:requestId', reportsController.deleteReport);

module.exports = { reportsRouter };
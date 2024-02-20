const { Router } = require('express');
const { requestsController } = require('../controllers/requestController');

const requestsRouter = new Router();

requestsRouter.get('/', requestsController.getAllRequests);
requestsRouter.get('/:requestId', requestsController.getRequestById);
requestsRouter.post('/', requestsController.createRequest);
requestsRouter.put('/:requestId', requestsController.updateRequest);
requestsRouter.delete('/:requestId', requestsController.deleteRequest);

module.exports = { requestsRouter };

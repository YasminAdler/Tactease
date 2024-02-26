const mongoose = require('mongoose');

const {
  findRequests,
  findSoldierRequests,
  retrieveRequest,
  createRequest,
  updateRequest,
  deleteRequest,
} = require('../repositories/requestRepository');
const { EntityNotFoundError, PropertyNotFoundError, BadRequestError } = require('../errors/errors');

exports.requestsController = {
  async getAllRequests(req, res, next) {
    try {
      const { soldierId } = req.params;
      let requests = null;
      // if (soldierId !== 'all') {
      //   requests = await findSoldierRequests(soldierId);
      // } else {
      requests = await findRequests();
      // }
      if (!requests || requests.length === 0) throw new EntityNotFoundError('requests');
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  },

  async getRequestById(req, res, next) {
    // const { soldierId } = req.params.soldierId;
    const { requestId } = req.params;
    try {
      const isId = mongoose.isValidObjectId(requestId);
      if (!isId) throw new BadRequestError('id');
      const request = await retrieveRequest(requestId);
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  },

  async createRequest(req, res, next) {
    try {
      // const { soldierId } = req.params.soldierId;
      if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
      const {
        soldierId, requestType, daysOffType, startDate, endDate,
      } = req.body;
      if (
        !soldierId
                || !requestType
                || !daysOffType
                || !startDate
                || !endDate
      ) throw new PropertyNotFoundError('create - missing arguments');
      const request = await createRequest(req.body);
      res.status(200).json(request);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async deleteRequest(req, res, next) {
    try {
      // const { soldierId } = req.params.soldierId;
      const { requestId } = req.params;
      const isId = mongoose.isValidObjectId(requestId);
      if (!isId) throw new BadRequestError('id');
      const request = await deleteRequest(requestId);
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      res.status(200).json(request);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async updateRequest(req, res, next) {
    try {
      // const { soldierId } = req.params.soldierId;
      const { requestId } = req.params;
      const isId = mongoose.isValidObjectId(requestId);
      if (!isId) throw new BadRequestError('id');
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
      const request = await updateRequest(requestId, req.body);
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  },
};

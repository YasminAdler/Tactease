const mongoose = require('mongoose');

// const {
//   findRequests,
//   findSoldierRequests,
//   retrieveRequest,
//   // createRequest,
//   updateRequest,
//   // deleteRequest,
// } = require('../repositories/requestRepository');

const {
  // findSoldiers,
  retrieveSoldier,
  createRequest,
  deleteRequest,
  updateRequest,
  // createSoldier,
  // updateSoldier,
  // deleteSoldier,
  // retrieveSoldierByClass,
} = require('../repositories/soldierRepository');
const { EntityNotFoundError, PropertyNotFoundError, BadRequestError } = require('../errors/errors');

exports.requestsController = {
  async getAllRequests(req, res, next) {
    try {
      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      const requests = soldier.requestList;
      if (!requests || requests.length === 0) throw new EntityNotFoundError('requests');
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  },

  async getRequestById(req, res, next) {
    try {
      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      const { requestId } = req.params;
      if (!requestId || isNaN(requestId)) throw new BadRequestError('id');
      const request = soldier.requestList[requestId];
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      res.status(200).json(request);
    } catch (error) {
      next(error);
    }
  },

  async createRequest(req, res, next) {
    try {
      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
      const {
        requestType, daysOffType, startDate, endDate,
      } = req.body;
      if (
        !requestType
                || !daysOffType
                || !startDate
                || !endDate
      ) throw new PropertyNotFoundError('create - missing arguments');
      const request = req.body;
      const updatedSoldier = await createRequest(req.soldierId, request);
      res.status(200).json(updatedSoldier);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async deleteRequest(req, res, next) {
    try {
      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      const { requestId } = req.params;
      if (!requestId || isNaN(requestId)) throw new BadRequestError('id');
      const request = soldier.requestList[requestId];
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      const updatedSoldier = await deleteRequest(req.soldierId, request);
      res.status(200).json(updatedSoldier);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async updateRequest(req, res, next) {
    try {
      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      const { requestId } = req.params;
      if (!requestId || isNaN(requestId)) throw new BadRequestError('id');
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
      const request = soldier.requestList[requestId];
      if (!request || request.length === 0) throw new EntityNotFoundError(`Request with id <${requestId}>`);
      Object.assign(request, req.body);
      const updatedSoldier = await updateRequest(req.soldierId, requestId, request);
      res.status(200).json(updatedSoldier);
    } catch (error) {
      next(error);
    }
  },
};

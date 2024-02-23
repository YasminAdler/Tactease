/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const {
  findMissions,
  retrieveMission,
  createMission,
  updateMission,
  deleteMission,
} = require('../repositories/missionsRepository');
const { EntityNotFoundError, PropertyNotFoundError, BadRequestError } = require('../errors/errors');

exports.missionsController = {
  async getMissions(req, res, next) {
    try {
      const missions = await findMissions();
      if (!missions || missions.length === 0) throw new EntityNotFoundError('missions');
      res.status(200).json(missions);
    } catch (error) {
      next(error);
    }
  },
  async getMissionByID(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      const mission = await retrieveMission(missionId);
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(200).json(mission);
    } catch (error) {
      next(error);
    }
  },
  async addMission(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
      const {
        missionType, startDate, endDate, soldierCount,
      } = req.body;
      if (!missionType || !startDate || !endDate || !soldierCount) throw new BadRequestError('mission - missing arguments');
      const mission = await createMission(req.body);
      res.status(200).json(mission);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },
  async updateMission(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
      const mission = await updateMission();
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(200).json(mission);
    } catch (error) {
      next(error);
    }
  },
  async deleteMission(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      const mission = await deleteMission();
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(200).json(mission);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },
};

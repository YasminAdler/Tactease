const mongoose = require('mongoose');

const {
  findSoldiers,
  retrieveSoldier,
  createSoldier,
  updateSoldier,
  deleteSoldier,
} = require('../repositories/soldierRepository');
const { EntityNotFoundError, PropertyNotFoundError, BadRequestError } = require('../errors/errors');

exports.soldiersController = {
  async getAllSoldiers(req, res, next) {
    try {
      const soldier = await findSoldiers();
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError('Soldier');
      res.status(200).json(soldier);
    } catch (error) {
      next(error);
    }
  },

  async getSoldierById(req, res, next) {
    const { soldierId } = req.params;
    try {
      const isId = mongoose.isValidObjectId(soldierId);
      if (!isId) throw new BadRequestError('id');
      const soldier = await retrieveSoldier(soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`soldier with id <${soldierId}>`);
      res.status(200).json(soldier);
    } catch (error) {
      next(error);
    }
  },

  async createSoldier(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
      const {
        personalNumber, fullName, depClass, pakal,
      } = req.body;
      if (
        !personalNumber
                || !fullName
                || !depClass
                || !pakal
      ) throw new PropertyNotFoundError('create - missing arguments');
      const soldier = await createSoldier(req.body);
      res.status(200).json(soldier);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async deleteSoldier(req, res, next) {
    try {
      const { soldierId } = req.params;
      const isId = mongoose.isValidObjectId(soldierId);
      if (!isId) throw new BadRequestError('id');
      const soldier = await deleteSoldier(soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`soldier with id <${soldierId}>`);
      res.status(200).json(soldier);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async updateSoldier(req, res, next) {
    try {
      const { soldierId } = req.params;
      const isId = mongoose.isValidObjectId(soldierId);
      if (!isId) throw new BadRequestError('id');
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
      const soldier = await updateSoldier(soldierId, req.body);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`soldier with id <${soldierId}>`);
      res.status(200).json(soldier);
    } catch (error) {
      next(error);
    }
  },
};

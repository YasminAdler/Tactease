/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

// password handler
const bcrypt = require('bcrypt');

const {
  findSoldiers,
  retrieveSoldier,
  createSoldier,
  updateSoldier,
  deleteSoldier,
  retrieveSoldierByClass,
  retrieveSoldierByPN,
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

  async getSoldiersByClassId(req, res, next, classId) {
    try {
      const soldier = await retrieveSoldierByClass(classId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`class with id <${classId}>`);
      return soldier;
    //  res.status(200).json(soldier);
    } catch (error) {
      next(error);
    }
    return null; // Add this line to return a value at the end of the method
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
      // const hashedPassword = await bcrypt.hash(password, 10);
      // req.body.password = hashedPassword;
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

  async login(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('login');
      const { personalNumber, password } = req.body;
      if (!personalNumber || !password) throw new PropertyNotFoundError('Login - missing arguments');
      const soldier = await retrieveSoldierByPN(personalNumber);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`soldier with personal number <${personalNumber}>`);
      const {
        fullName, depClass, pakal, requestList,
      } = soldier;
      if (req.session.authenticated) {
        res.json(req.session);
      } else if (await bcrypt.compare(password, soldier.password)) {
        req.session.authenticated = true;
        req.session.user = {
          personalNumber, fullName, depClass, pakal, requestList,
        };
        res.status(200).json(req.session.user);
      } else {
        throw new BadRequestError('password');
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      req.session.destroy(req.session.sessionID);
      res.status(200).json('logged out');
    } catch (error) {
      next(error);
    }
  },
};

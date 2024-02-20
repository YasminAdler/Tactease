const mongoose = require('mongoose');
const { PythonShell } = require('python-shell');
let options = {
  scriptPath: "../../algorithm"
}
PythonShell.run('cpAlgorithm.py', options,(err, results) => {
  if (err) console.log(err)
  if (results) console.log(results)
});
// const { spawn } = require('child_process');
// const executeAlgorithm = async (script,args) => {
//   // const arguments = args.ToString();

//   const py = spawn('python', [script, args]);

//   const result = new Promise((resolve, reject) => {
//     let output;
//     py.stdout.on('data', (data) => {
//       output = JSON.parse(data);
//     });

//     py.stderr.on('data', (data) => {
//       console.error(`Python algorithm error: ${data}`);
//       reject(`Error occurred in ${script}`);
//     });

//     py.on('exit', (code) => {
//       console.log(`Python algorithm exited with code ${code}`);
//       resolve(output);
//     });
//   });

//   return result;
// }

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
      const result = {
        status: 200,
        message: '',
        data: await findMissions(),
      };
      if (result.data.length === 0 || !result.data) throw new EntityNotFoundError('missions');
      res.status(result.status);
      res.json(result.message || result.data);
    } catch (error) {
      next(error);
    }
  },
  async getMissionByID(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new PropertyNotFoundError('id');
      const result = {
        status: 200,
        message: '',
        data: await retrieveMission(missionId),
      };
      if (result.data.length === 0 || !result.data) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(result.status);
      res.json(result.message || result.data);
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
      if (!missionType || !startDate || !endDate || !soldierCount) throw new PropertyNotFoundError('mission - missing arguments');
      const result = {
        status: 201,
        message: '',
        data: await createMission(req.body),
      };
      res.status(result.status);
      res.json(result.message || result.data);
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
      const result = {
        status: 200,
        message: '',
        data: await updateMission(missionId, req.body),
      };
      if (!result.data || result.data.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(result.status);
      res.json(result.message || result.data);
    } catch (error) {
      next(error);
    }
  },
  async deleteMission(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      const result = {
        status: 200,
        message: '',
        data: await deleteMission(missionId),
      };
      if (!result.data || result.data.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(result.status);
      res.json(result.message || result.data);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },
};

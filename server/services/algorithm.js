const { PythonShell } = require('python-shell');
const { BadRequestError } = require('../errors/errors');
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');

const options = {
  scriptPath: 'algorithm',
  mode: 'JSON',
  args: [],
};

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const missionRes = await missionsController.addMission(req, res, next);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorith: missionRes is empty');

      const { classId } = missionRes.data.depClass;
      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, classId);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorith: soldiersRes is empty');

      options.args = [missionRes, soldiersRes];
      const algRes = await PythonShell.run('cpAlgorithm.py', options);
      if (!algRes || algRes.length === 0) throw new BadRequestError('algorith: algRes is empty');

      res.status(200).json(algRes);
    } catch (error) {
      next(error);
    }
  },
};

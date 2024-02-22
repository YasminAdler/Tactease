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
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: missionRes is empty');
      //const { classId } = missionRes.data.depClass;
      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: soldiersRes is empty');
      options.args = [JSON.stringify(missionRes), JSON.stringify(soldiersRes)];
      PythonShell.run('cpAlgorithm.py', options, (err, algRes) => {
        if (err) throw err;
        if (!algRes || algRes.length === 0) throw new BadRequestError('algorithm: algRes is empty');
        
        console.log('algRes:', algRes);
        res.status(200).json(algRes);
      });
      
    } catch (error) {
      next(error);
    }
  },
};

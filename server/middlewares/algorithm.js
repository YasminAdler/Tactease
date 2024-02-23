const spawner = require('child_process').spawn;
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');
const { EntityNotFoundError } = require('../errors/errors');

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const missionRes = await missionsController.addMissionToAlg(req, res, next);
      if (!missionRes || missionRes.length === 0) throw new EntityNotFoundError('algorithm: missionRes is empty');

      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
      if (!soldiersRes || soldiersRes.length === 0) throw new EntityNotFoundError('algorithm: soldiersRes is empty');

      const missionsJSON = JSON.stringify(missionRes);
      const soldiersJSON = JSON.stringify(soldiersRes);

      const dataToPass = {
        dataSend: [missionsJSON, soldiersJSON],
      };

      const pythonProcess = spawner('python', ['algorithm/cpAlgorithm.py', JSON.stringify(dataToPass)]);

      pythonProcess.stdout.on('data', (data) => {
        const retrievedData = JSON.parse(data.toString());
        console.log(retrievedData);
      });
    } catch (error) {
      next(error);
    }
  },
};

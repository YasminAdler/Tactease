const spawner = require('child_process').spawn;
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');
const { EntityNotFoundError } = require('../errors/errors');

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const missionRes = await missionsController.addMission(req, res, next);
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


// const options = {
//   scriptPath: 'algorithm',
//   mode: 'JSON',
//   args: [],
// };

// exports.algorithmController = {
//   async executeAlgorithm(req, res, next) {
//     try {
//       const missionRes = await missionsController.addMission(req, res, next);
//       if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: missionRes is empty');
//       //const { classId } = missionRes.data.depClass;
//       const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
//       if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: soldiersRes is empty');
//       options.args = [JSON.stringify(missionRes), JSON.stringify(soldiersRes)];
//       PythonShell.run('cpAlgorithm.py', options, (err, algRes) => {
//         if (err) throw err;
//         if (!algRes || algRes.length === 0) throw new BadRequestError('algorithm: algRes is empty');
//         const missionJson = JSON.parse(algRes[0]);

//         console.log('algRes:', missionJson);
//         res.status(200).json(missionJson);
//       });

//     } catch (error) {
//       next(error);
//     }
//   },
// };

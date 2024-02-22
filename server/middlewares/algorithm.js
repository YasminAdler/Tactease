const { BadRequestError } = require('../errors/errors');
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');
const spawner = require('child_process').spawn;

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const missionRes = await missionsController.addMission(req, res, next);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: missionRes is empty');

      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: soldiersRes is empty');

      const missionsJSON = JSON.stringify(missionRes);
      const soldiersJSON = JSON.stringify(soldiersRes);

      // const dataToPass = {
      //   dataSend: [missionsJSON, soldiersJSON],
      //   dataRecieve: {},
      // };

      let retrievedData = '';

      const pythonProcess = spawner('python3', ['-c', `import algorithm.cpAlgorithm; algorithm.cpAlgorithm.scheduleAlg(${missionsJSON}, ${soldiersJSON})`]);

      pythonProcess.stdout.on('data', (data) => {
        retrievedData += JSON.stringify(data);
        if (!res.headersSent) { // Check if headers have already been sent
          res.status(200).json(retrievedData);
          console.log(retrievedData);
        }
        // res.status(200).json(retreivedData);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(400).json(data);
      });
      // pythonProcess.stdout.pipe(process.stdout);
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          const parsedData = JSON.parse(retrievedData);
          res.status(200).json(parsedData);
        } else {
          console.log(`child process exited with code ${code}`);
        }
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

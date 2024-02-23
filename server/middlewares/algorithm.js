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

      // console.log('missionsJSON:', missionsJSON);
      // console.log('soldiersJSON:', soldiersJSON);

      // const dataToPass = {
      //   dataSend: [missionsJSON, soldiersJSON],
      //   dataRecieve: {},
      // };

      // let retrievedData = '';

      const pythonProcess = spawner('python', ['-c', `import algorithm.cpAlgorithm; algorithm.cpAlgorithm.scheduleAlg(${missionsJSON}, ${soldiersJSON})`]);

      pythonProcess.stdout.on('data', (data) => {
        const retrievedData = JSON.parse(data.toString());
        if (!res.headersSent) { // Check if headers have already been sent
          res.status(200).json(retrievedData);
        }
      });

      let errorData = ''; // Store error data
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        errorData += data.toString(); // Append error data
      });

      // Handle process close event
      pythonProcess.on('close', (code) => {
        // If the process exits with an error code and the response hasn't been sent yet
        if (code !== 0 && !res.headersSent) {
          res.status(400).json({ error: errorData }); // Send error response
        }
      });

      // pythonProcess.stdout.on('data', (data) => {
      //   const retrievedData = JSON.parse(data.toString());
      //   if (!res.headersSent) { // Check if headers have already been sent
      //     res.status(200).json(retrievedData);
      //     // console.log(retrievedData);
      //   }
      //   // res.status(200).json(retreivedData);
      // });

      // pythonProcess.stderr.on('data', (data) => {
      //   console.error(`stderr: ${data}`);
      //   res.status(400).json(data);
      // });
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

const { BadRequestError } = require('../errors/errors');
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');
const spawner = require('child_process').spawn;


exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try{

      const missionRes = await missionsController.addMission(req, res, next);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: missionRes is empty');

      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: soldiersRes is empty');

      missionsJSON = JSON.stringify(missionRes);
      soldiersJSON = JSON.stringify(soldiersRes);

      const dataToPass = {
        dataSend: [ missionsJSON, soldiersJSON ],
        dataRecieve: {}
       };
      
      const pythonProcess = spawner('python', ['algorithm/cpAlgorithm.py', JSON.stringify(dataToPass)]);
      
      pythonProcess.stdout.on('data', (data) => {
        const retreivedData = JSON.parse(data.toString());
        console.log(retreivedData);
      });
    }catch(error){
      next(error);
    }

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

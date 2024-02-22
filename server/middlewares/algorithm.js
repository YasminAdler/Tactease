const { PythonShell } = require('python-shell');
const { BadRequestError } = require('../errors/errors');
const { soldiersController } = require('../controllers/soldierController');
const { missionsController } = require('../controllers/missionsController');
var bodyParser = require('body-parser'); 
var request = require('request-promise'); 


exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const missionRes = await missionsController.addMission(req, res, next);
      if (!missionRes || missionRes.length === 0) throw new BadRequestError('algorithm: missionRes is empty');
      //const { classId } = missionRes.data.depClass;
      const soldiersRes = await soldiersController.getSoldiersByClassId(req, res, next, 40);
      if (!soldiersRes || soldiersRes.length === 0) throw new BadRequestError('algorithm: soldiersRes is empty');
      
      const options = {
        method: 'POST',
        uri: 'http://localhost:3030/schedule',
        mode: 'JSON',
        body: [missionRes, soldiersRes],
        json: true 
      };
       
      
      const receivedData = [];
      const sendRequest = await request(options)
        .then((parsedBody) => {
            console.log(parsedBody);
            receivedData = parsedBody;
        })
        .catch(function (err) { 
          res.status(400).json(receivedData);
          console.log(err); 
      }); 

      res.status(200).json(receivedData);
  
    // //  options.args = [JSON.stringify(missionRes), JSON.stringify(soldiersRes)];
    //   PythonShell.run('cpAlgorithm.py', options, (err, algRes) => {
    //     if (err) throw err;
    //     if (!algRes || algRes.length === 0) throw new BadRequestError('algorithm: algRes is empty');
    //     const missionJson = JSON.parse(algRes[0]);
        
    //     console.log('algRes:', missionJson);
    //     res.status(200).json(missionJson);
    //   });
      
    } catch (error) {
      next(error);
    }
  },
};

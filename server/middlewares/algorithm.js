const spawner = require('child_process').spawn;
const path = require('path');
const {
  createMission,
  updateMission,
  deleteMission,
} = require('../repositories/missionsRepository');

const {
  retrieveSoldierByClass,
} = require('../repositories/soldierRepository');

const { EntityNotFoundError, BadRequestError } = require('../errors/errors');

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
      const pythonPath = process.env.ORTOOLS_PATH;
      if (!pythonPath) {
        console.error('ORTOOLS_PATH is not set in the .env file.');
        process.exit(1); // Exit the application if ORTOOLS_PATH is not set
      }

      process.env.PYTHONPATH = path.join(__dirname, pythonPath);

      if (Object.keys(req.body).length === 0) throw new BadRequestError('create');
      const {
        missionType, startDate, endDate, soldierCount,
      } = req.body;
      if (!missionType || !startDate || !endDate || !soldierCount) throw new BadRequestError('mission - missing arguments');
      const missionRes = await createMission(req.body);
      if (!missionRes || missionRes.length === 0) throw new EntityNotFoundError('algorithm: missionRes is empty');

      let missionArr = [];
      if (!Array.isArray(missionRes)) {
        missionArr = [missionRes];
      } else {
        missionArr = missionRes;
      }
      const soldierRes = await retrieveSoldierByClass(missionRes.classId);
      if (!soldierRes || soldierRes.length === 0) throw new EntityNotFoundError(`class with id <${classId}>`);

      const missionsJSON = JSON.stringify(missionArr);
      const soldiersJSON = JSON.stringify(soldierRes);

      const pythonProcess = spawner('python', ['-c', `import algorithm.cpAlgorithm; algorithm.cpAlgorithm.scheduleAlg(${missionsJSON}, ${soldiersJSON})`]);

      pythonProcess.stdout.on('data', async (data) => {
        try {
          const retrievedData = JSON.parse(data); // Parse the data to JSON object
          if (retrievedData.includes('error')) {
            deleteMission(missionRes._id);
            throw new EntityNotFoundError('algorithm: not found schedule');
          }

          if (retrievedData.length === 0) throw new EntityNotFoundError('algorithm: retrievedData is empty');

          const getKey = Object.keys(retrievedData[0]);
          const id = getKey[0];
          const values = retrievedData[0][id];
          const updated = await updateMission(id, { soldiersOnMission: values });
          res.status(200).json(updated);
        } catch (error) {
          next(error);
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
    } catch (error) {
      next(error);
    }
  },
};

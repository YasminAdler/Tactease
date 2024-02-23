const spawner = require('child_process').spawn;
const {
  createMission,
  updateMission,
} = require('../repositories/missionsRepository');

const {
  retrieveSoldierByClass,
} = require('../repositories/soldierRepository');

const { EntityNotFoundError, BadRequestError } = require('../errors/errors');

exports.algorithmController = {
  async executeAlgorithm(req, res, next) {
    try {
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

      const classId = 40;
      const soldierRes = await retrieveSoldierByClass(classId);
      if (!soldierRes || soldierRes.length === 0) throw new EntityNotFoundError(`class with id <${classId}>`);

      const missionsJSON = JSON.stringify(missionArr);
      const soldiersJSON = JSON.stringify(soldierRes);

      const pythonProcess = spawner('python', ['-c', `import algorithm.cpAlgorithm; algorithm.cpAlgorithm.scheduleAlg(${missionsJSON}, ${soldiersJSON})`]);

      pythonProcess.stdout.on('data', async (data) => {
        const retrievedData = JSON.parse(data); // Parse the data to JSON object
        const getKey = Object.keys(retrievedData[0]);
        const id = getKey[0];
        console.log(id);
        const values = retrievedData[0][id];
        console.log(values);
        const updated = await updateMission(id, { soldiersOnMission: values });
        res.status(200).json(updated);
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

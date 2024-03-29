
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { missionsController } = require('../controllers/missionsController');


// create a new function diiferent middleWare from  that recieves a string 
// that sayes generateSchedule/add_mission (exactly how it is written after the "/"),
// and it recieves a new mission and the string, it is going to run the flask
// and does a return of what is returned from the flask
// what that is being returned from the flask is being send to the middleware 


exports.algorithmController = {
  /**
 * Connects to the Flask server to either generate a schedule or add a mission.
 * @param {string} requestString - The Flask API endpoint (generateSchedule or add_mission).
 * @param {Object} newMission - The mission data to send to the Flask API.
 * @param {Array} soldiers - The soldiers data to send to the Flask API.
 * @returns {Object} The response data from the Flask API.
 */
  async flaskConnection(requestString, newMission, soldiers) {
    const flaskApiUrl = `http://localhost:5000/${requestString}`;
    try {
      // Determine the appropriate payload based on the requestString
      let payload;
      if (requestString === 'generateSchedule') {
        payload = { missions: JSON.stringify([newMission]), soldiers: JSON.stringify(soldiers) };
      } else if (requestString === 'add_mission') {
        payload = { schedule: JSON.stringify({}), new_mission: JSON.stringify(newMission), soldiers: JSON.stringify(soldiers) };
      } else {
        throw new Error('Invalid requestString provided to flaskConnection');
      }

      // Make the POST request to the Flask API
      const response = await axios.post(flaskApiUrl, payload);
      return response.data;
    } catch (error) {
      console.error(`Error connecting to Flask API at ${flaskApiUrl}:`, error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  async middleWare(req, res, next) {
    try {
      const missions = await missionsController.getMissions();
      if (!Array.isArray(req.body)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Expected an array of missions in the request body.' });
      }
      const processedMissions = req.body.map((mission, index) => ({ ...mission, _id: index }));
      if (!missions) {
        const result = await this.flaskConnection('generate_schedule', processedMissions);
        res.status(200).json(result);
      }
      else {
        const result = await this.flaskConnection('add_mission', processedMissions);
        res.status(200).json(result);
      }
    }
    catch (error) {
      next(error);
    }
  },
}
//  את הריזולט מהפלסק צריך לבדוק 
// אם מקבלים מערך ריק זורקים אררור מההנדלר אחרת צריך למחוק את האיי די הזמני מכל הפרססד מישיונס ולעשות בקונטרולר אד מישיון 
// 

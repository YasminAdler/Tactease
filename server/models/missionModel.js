const { Schema, model } = require('mongoose');

const MissionSchema = new Schema({
  missionType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  soldierCount: { type: Number, required: true},
  soldiersOnMission: { type: Array },
}, { collection: 'missions' });

module.exports = model('mission', MissionSchema);

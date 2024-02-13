const { Schema, model } = require('mongoose')
const MissionSchema = new Schema({
  missionId: { type: Number },
  missionType: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  soldierCount: { type: Number },
  soldiersOnMission: { type: Array }
}, { collection: 'missions' })

module.exports = model('Mission', MissionSchema)

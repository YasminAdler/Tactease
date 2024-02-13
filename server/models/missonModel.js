const { Schema, model } = require('mongoose')
const MissionSchema = new Schema({
  missionId: { type: Number },
  missionType: { type: String },
  location: { type: String },
  deathCount: { type: Number },
  damage: { type: String }
}, { collection: 'missions' })

module.exports = model('Mission', MissionSchema)

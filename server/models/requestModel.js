const { Schema, model, ObjectId } = require('mongoose');

const RequestModel = new Schema({
  soldierId: { type: ObjectId, required: true },
  requestType: { type: String, required: true },
  daysOffType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  note: { type: String },
  fileName: { type: String },
}, { collection: 'requests' });

module.exports = model('request', RequestModel);

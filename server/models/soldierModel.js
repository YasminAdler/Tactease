const { Schema, model } = require('mongoose');

const ClassModel = new Schema({
  classId: { type: Number, required: true },
  className: { type: String, required: true },
}, { collection: 'classes' });

const RequestModel = new Schema({
  requestType: { type: String, required: true },
  daysOffType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  note: { type: String },
  fileName: { type: String },
});

const SoldierModel = new Schema({
  personalNumber: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  depClass: ClassModel,
  pakal: { type: String, required: true },
  requestList: [RequestModel],
}, { collection: 'soldiers' });

module.exports = model('soldier', SoldierModel);

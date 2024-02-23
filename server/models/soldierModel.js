const { Schema, model } = require('mongoose');

const ClassModel = new Schema({
  classId: { type: Number, required: true },
  className: { type: String, required: true },
}, { collection: 'classes' });

const SoldierModel = new Schema({
  personalNumber: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  depClass: ClassModel,
  pakal: { type: String, required: true },
  requestList: [],
}, { collection: 'soldiers' });

module.exports = model('soldier', SoldierModel);

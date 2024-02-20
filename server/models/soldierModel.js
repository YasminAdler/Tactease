const { Schema, model, ObjectId } = require('mongoose')
const ClassModel = new Schema({
    className: { type: String, required: true }
}, { collection: 'classes' })

const SoldierModel = new Schema({
    personalNumber: { type: Number, required: true, unique: true},
    fullName: { type: String, required: true },
    depClass: ClassModel,
    pakal: { type: String, required: true },
    requestList: [],
}, { collection: 'soldiers' })

module.exports = model('soldier', SoldierModel)

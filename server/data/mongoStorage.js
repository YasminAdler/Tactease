const { EventEmitter } = require('events');
const mongoose = require('mongoose');
const Path = require('path');

module.exports = class mongoStorage extends EventEmitter {
  constructor(entity) {
    super();

    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}Model.js`));
    this.connect();
  }

  connect() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    mongoose
      .connect(connectionUrl)
      .then(() => console.log(`connected to ${this.entityName} collection`))
      .catch((err) => console.log(`connection error: ${err}`));
  }

  find() {
    return this.Model.find();
  }

  retrieve(id) {
    return this.Model.find(id);
  }

  create(data) {
    const newEntity = new this.Model(data);
    return newEntity.save();
  }

  delete(id) {
    return this.Model.findByIdAndDelete(id);
  }

  update(id, data) {
    return this.Model.findOneAndUpdate(id, data, { new: true });
  }
};

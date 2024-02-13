const MongoStorage = require('../data/mongoStorage')
const localStorage = require('../data/localStorage')

module.exports = class missionsRepository  {
   constructor () {
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS){
    this.storage = new MongoStorage('mission')}
    else { this.storage = new localStorage('missions');}
   } 

   find () {
    return this.storage.find()
   }

   retrieve (id) {
    return this.storage.retrieve(id)
   }

   create (data) {
    return this.storage.create(data)
   }

   update (id, data) {
    return this.storage.update(id,data)
   }

   delete (id) {
    return this.storage.delete(id)
   }
}
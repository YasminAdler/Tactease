const MongoStorage = require('../data/mongoStorage')

exports.missionsRepository = {
   constructor () {this.storage = new MongoStorage('mission')} ,

   find () {
    return this.storage.find()
   },

   retrieve (id) {
    return this.storage.retrieve(id)
   },

   create (data) {
    return this.storage.create(data)
   },

   update (id, data) {
    return this.storage.update(id,data)
   },

   delete (id) {
    return this.storage.delete(id)
   }
}
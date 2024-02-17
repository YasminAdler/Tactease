const MongoStorage = require('../data/mongoStorage');
const { DuplicateError } = require('../errors/errors');

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASS) {
    this.storage = new MongoStorage('soldier');
}

const findSoldiers = () => this.storage.find({});

const retrieveSoldier = (id) => this.storage.retrieve({ _id: id });

const createSoldier = async (soldier) => {
    try{
        return await this.storage.create(soldier);
    } catch(error){
        throw new DuplicateError('Soldier');
    }
};

const updateSoldier = (id, soldier) => this.storage.update({ _id: id }, soldier);

const deleteSoldier = (id) => this.storage.delete({ _id: id });

module.exports = {
    findSoldiers, retrieveSoldier, createSoldier, updateSoldier, deleteSoldier,
};

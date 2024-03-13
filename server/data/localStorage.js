const { EventEmitter } = require('events');
const fs = require('fs');
const Path = require('path');

module.exports = class localStorage extends EventEmitter {
    constructor(entity) {
        super();
        this.dir = Path.join(__dirname, `./${entity}.json`);
        this.on('update-storage', () => {
            fs.writeFile(this.dir, JSON.stringify(this.data),'utf8', (err) => {
                if (err) throw err;
                console.log('The file has been saved!');

            });
        });
        this.connect();
        }

        connect() {
            this.storage ={
                data:require(this.dir),
                save: () => this.emit('update-storage')
            };
        }

        find (){
        return Promise.resolve(this.storage.data);
        }

        retrieve(id) {
            return Promise.resolve(this.storage.data.find(item => item.missionId === id));
        }

        create(data){
            const result = this.storage.data.push(data);
            this.storage.save();
            return Promise.resolve(result);
        }

        delete(id){
            const result = this.storage.data.filter(item => item.missionId !== id);
            this.storage.save(result);
            return Promise.resolve(result);
        }

        update(id,data){
            const result = this.storage.map(item => item.missionId === id ? ({missionId,...data}): item);
            this.storage.save();
            return Promise.resolve(result);
        }
}
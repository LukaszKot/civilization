var Datastore = require('nedb')

class SavesRepository {
    constructor() {
        this._collection = new Datastore({
            filename: "db/saves.db",
            autoload: true
        })
    }

    insert(save) {
        return new Promise((accept, reject) => {
            this._collection.insert(save, (err, newDoc) => {
                if (err) reject(err);
                accept(newDoc);
            })
        })
    }

    getSingle(id) {
        return new Promise((accept, reject) => {
            this._collection.findOne({ _id: id }, (err, docs) => {
                if (err) reject(err);
                accept(docs)
            })
        })
    }

    update(save) {
        return new Promise((accept, reject) => {
            this._collection.update({ _id: save._id }, { $set: save }, {}, (err, numUpdated) => {
                if (err) reject(err);
                accept(save);
            })
        })
    }

    deleteSave(id) {
        return new Promise((accept, reject) => {
            this._collection.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) reject(err)
                accept(numRemoved)
            })
        })
    }
}

module.exports = { SavesRepository };
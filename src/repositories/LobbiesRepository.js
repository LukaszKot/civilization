var Datastore = require('nedb')

class LobbiesRepository {
    constructor() {
        this._collection = new Datastore({
            filename: 'db/lobbies.db',
            autoload: true
        })
    }

    getAll() {
        return new Promise((accept, reject) => {
            this._collection.find({}, (err, docs) => {
                if (err) reject(err);
                accept(docs)
            })
        })
    }

    getSingle(name) {
        return new Promise((accept, reject) => {
            this._collection.findOne({ name: name }, (err, docs) => {
                if (err) reject(err);
                accept(docs)
            })
        })
    }

    insert(name, players = [], save = null) {
        return new Promise((accept, reject) => {
            var doc = {
                name: name,
                players: players,
                save: null
            }
            this._collection.insert(doc, (err, newDoc) => {
                if (err) reject(err);
                accept(newDoc);
            })
        })
    }

    update(lobby) {
        return new Promise((accept, reject) => {
            this._collection.update({ _id: lobby._id }, { $set: lobby }, {}, (err, numUpdated) => {
                if (err) reject(err)
                accept(lobby)
            })
        })
    }

    delete(id) {
        return new Promise((accept, reject) => {
            this._collection.remove({ _id: id }, {}, (err, numRemoved) => {
                if (err) reject(err)
                accept(numRemoved)
            })
        })
    }

    drop() {
        this._collection.remove({}, { multi: true }, function (err, numRemoved) {
        });
    }
}

module.exports = { LobbiesRepository }
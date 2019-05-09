var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;

app.use(express.static('static'))
var path = require('path')
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
}

var lobbiesRepository = new LobbiesRepository();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get("/api/lobbies", function (req, res) {
    lobbiesRepository.getAll()
        .then(x => {
            res.send(x);
        })
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
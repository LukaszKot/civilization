var http = require("http");
var express = require("express")
var app = express()
const PORT = 3000;

app.use(express.static('static'))
app.use(express.json())
var path = require('path')
var Datastore = require('nedb')

var server = app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

var io = require('socket.io')(server);

var sockets = []
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
}

var lobbiesRepository = new LobbiesRepository();

io.on('connection', (socket) => {
    socket.on("JOIN_THE_LOBBY", (msg) => {
        var socketObject = {
            socket: socket,
            name: msg.name,
            lobby: msg.lobby
        }
        sockets.push(socketObject)
        var currentLobby = []
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].lobby == msg.name) {
                currentLobby.push(sockets[i])
            }
        }
        if (currentLobby.length > 2) {
            socket.emit("LOBBY_IS_ALREADY_FULL")
        }
        else {
            lobbiesRepository.getSingle(msg.name)
                .then(x => {
                    var player = {
                        name: player.name,
                        civilization: null
                    }
                    x.players.push(player)
                    return lobbiesRepository.update(x)
                })
                .then(x => {
                    currentLobby.forEach(theSocket => {
                        theSocket.socket.emit("PLAYER_JOINED_THE_LOBBY", x)
                    });
                })
        }
    })
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get("/api/lobbies", function (req, res) {
    lobbiesRepository.getAll()
        .then(x => {
            var dto = [];
            x.forEach(element => {
                dto.push({
                    name: element.name,
                    players: element.players,
                    save: element.save
                })
            });

            res.send(dto);
        })
})

app.post("/api/lobbies", function (req, res) {
    var command = req.body;
    lobbiesRepository.getSingle(command.name)
        .then(x => {
            if (x) res.send({
                event: "LOBBY_WITH_THAT_NAME_ALREADY_EXISTS"
            })
            else return lobbiesRepository.insert(command.name)
        })
        .then(x => {
            if (x) res.send({
                event: "LOBBY_CREATED",
                body: {
                    name: x.name
                }
            })
        })
})
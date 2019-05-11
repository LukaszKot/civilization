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
}

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
var savesRepository = new SavesRepository();

io.on('connection', (socket) => {
    var currentLobby;
    socket.on("JOIN_THE_LOBBY", (msg) => {
        var command = JSON.parse(msg)
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST"
                var socketObject = {
                    socket: socket,
                    name: command.name,
                    lobby: command.lobby
                }
                sockets.push(socketObject)
                currentLobby = []
                for (var i = 0; i < sockets.length; i++) {
                    if (sockets[i].lobby == command.lobby) {
                        currentLobby.push(sockets[i])
                    }
                }
                if (currentLobby.length > 2) {
                    for (var i = sockets.length - 1; i >= 0; i--) {
                        if (sockets[i].name == command.name && sockets[i].lobby == command.lobby) {
                            sockets.splice(i, 1)
                            throw "LOBBY_IS_ALREADY_FULL";
                        }
                    }

                }
                else if (currentLobby.length == 2 && currentLobby[0].name == currentLobby[1].name) {
                    for (var i = sockets.length - 1; i >= 0; i--) {
                        if (sockets[i].name == command.name && sockets[i].lobby == command.lobby) {
                            sockets.splice(i, 1)
                            throw "GIVEN_NAME_IS_ALREADY_TAKEN";
                        }
                    }
                }
                else {
                    var player = {
                        name: command.name,
                        civilization: null
                    }
                    x.players.push(player)
                    return lobbiesRepository.update(x)

                }
            })
            .then(x => {
                if (x) currentLobby.forEach(theSocket => {
                    theSocket.socket.emit("PLAYER_JOINED_THE_LOBBY", JSON.stringify(x))

                })

            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
    })

    socket.on("CHOOSE_CIVILIZATION", (msg) => {
        var command = JSON.parse(msg)
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                currentLobby = []
                for (var i = 0; i < sockets.length; i++) {
                    if (command.lobby == sockets[i].lobby) {
                        currentLobby.push(sockets[i])
                    }
                }
                var isPlayerExist = false
                for (var i = 0; i < x.players.length; i++) {
                    if (x.players[i].name == command.name) {
                        isPlayerExist = true;
                        x.players[i].civilization = command.civilization;
                    }
                }
                if (!isPlayerExist) throw "PLAYER_DOES_NOT_EXIST";
                if (x.players.length > 1 && x.players[0].civilization == x.players[1].civilization && x.players[0].civilization != null) {
                    throw "CIVILIZATION_IS_ALREADY_CHOOSEN"
                }

                return lobbiesRepository.update(x)
            })
            .then(x => {
                if (x) currentLobby.forEach(theSocket => {
                    theSocket.socket.emit("CIVILIZATION_CHOOSEN", JSON.stringify(x))
                })
            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
    });

    socket.on("RENDER_MAP", (msg) => {
        var command = JSON.parse(msg);
        var lobby;
        var save;
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                currentLobby = []
                for (var i = 0; i < sockets.length; i++) {
                    if (command.lobby == sockets[i].lobby) {
                        currentLobby.push(sockets[i])
                    }
                }
                lobby = x;
                var tiles = []
                var mapSize = {
                    width: 100,
                    height: 50
                }
                for (var i = 0; i < 100; i++) {
                    for (var j = 0; j < 50; j++) {
                        var tile = {
                            id: mapSize.width * j + i,
                            position: {
                                x: i,
                                z: j
                            },
                            resources: {
                                food: Math.floor(Math.random() * 6),
                                gold: Math.floor(Math.random() * 6),
                                production: Math.floor(Math.random() * 6)
                            },
                        }
                        tiles.push(tile)
                    }
                }
                var save = {
                    turn: 0,
                    map: {
                        size: {
                            width: mapSize.width,
                            height: mapSize.height
                        },
                        tiles: tiles
                    }
                }
                return savesRepository.insert(save)
            })
            .then(x => {
                save = x;
                lobby.save = x._id;
                return lobbiesRepository.update(lobby)
            })
            .then(x => {
                var dto = {
                    name: lobby.name,
                    players: lobby.players,
                    save: {
                        turn: save.turn,
                        map: save.map.size
                    }
                }
                if (x) currentLobby.forEach(theSocket => {
                    theSocket.socket.emit("MAP_RENDERED", JSON.stringify(dto))
                })
            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
    })

    socket.on('disconnect', () => {
        var theSocket;
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].socket.id == socket.id) {
                theSocket = sockets[i];
                sockets.splice(i, 1)
                break;
            }
        }

        currentLobby = []
        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].lobby == theSocket.lobby) {
                currentLobby.push(sockets[i])
            }
        }

        if (currentLobby.length == 0) return;

        for (var i = 0; i < currentLobby.length; i++) {
            if (currentLobby[i].socket.id == theSocket.socket.id) {
                currentLobby.splice(i, 1)
                break;
            }
        }

        lobbiesRepository.getSingle(theSocket.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                for (var i = 0; i < x.players.length; i++) {
                    if (x.players[i].name == theSocket.name) {
                        x.players.splice(i, 1)
                        break;
                    }
                }
                return lobbiesRepository.update(x)
            })
            .then(x => {
                if (x) currentLobby.forEach(theSocket => {
                    theSocket.socket.emit("PLAYER_LEAVED_THE_LOBBY", JSON.stringify(x))
                })
            })
            .catch(x => { })
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
                    players: element.players.length,
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
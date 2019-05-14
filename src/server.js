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

class SocketRepository {
    constructor() {
        this.sockets = sockets;
    }

    insert(username, lobbyName, socket) {
        var socketObject = {
            socket: socket,
            name: username,
            lobby: lobbyName
        }
        this.sockets.push(socketObject)
    }

    getSocketsWhereLobbyIsEqualTo(lobbyName) {
        var socketsGroup = []
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].lobby == lobbyName) {
                socketsGroup.push(this.sockets[i])
            }
        }
        return socketsGroup;
    }

    getById(id) {
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].socket.id == id) return this.sockets[i]
        }
    }

    remove(socketId) {
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].socket.id == socketId) {
                this.sockets.splice(i, 1);
                return;
            }
        }
    }
}

var lobbiesRepository = new LobbiesRepository();
lobbiesRepository.drop();
var savesRepository = new SavesRepository();
var socketRepository = new SocketRepository();

io.on('connection', (socket) => {
    socket.on("JOIN_THE_LOBBY", (msg) => {
        var currentLobby;
        var command = JSON.parse(msg)
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST"
                socketRepository.insert(command.name, command.lobby, socket)
                currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(command.lobby)
                if (currentLobby.length > 2) {

                    throw "LOBBY_IS_ALREADY_FULL";
                }
                else if (currentLobby.length == 2 && currentLobby[0].name == currentLobby[1].name) {
                    socketRepository.remove(socket.id)
                    throw "GIVEN_NAME_IS_ALREADY_TAKEN";
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
        var currentLobby;
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(command.lobby)
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
        var currentLobby;
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(command.lobby)
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
        var theSocket = socketRepository.getById(socket.id);
        if (theSocket == null) return;
        socketRepository.remove(socket.id)
        var currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(theSocket.lobby)

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
                if (x && x.players.length == 0) {
                    lobbiesRepository.delete(x._id);
                }
            })
            .catch(x => { })
    })

    socket.on("KICK_PLAYER", (msg) => {
        var command = JSON.parse(msg);
        var currentLobby;
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";

                currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(command.lobby)

                if (command.playerName == x.players[0].name) throw "HOST_CANNOT_BE_KICKED";
                for (var i = 0; i < currentLobby.length; i++) {
                    if (currentLobby[i].name == command.playerName) {
                        currentLobby[i].socket.disconnect();
                    }
                }
            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
    })

    socket.on("START_GAME", (msg) => {
        var command = JSON.parse(msg);

        var currentLobby = socketRepository.getSocketsWhereLobbyIsEqualTo(command.lobby)
        var lobby;
        lobbiesRepository.getSingle(command.lobby)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                lobby = x;
                if (x.players.length != 2) throw "INVALID_PLAYER_NUMBER";

                x.players.forEach(player => {
                    if (player.civilization == null) {
                        throw "CIVILIZATION_NOT_SELECTED"
                    }
                });

                if (x.save == null) throw "SAVE_NOT_SELECTED";
                return savesRepository.getSingle(x.save)
            })
            .then(x => {
                x.players = lobby.players;
                return savesRepository.update(x)
            })
            .then(x => {
                return lobbiesRepository.delete(lobby._id)
            })
            .then(x => {
                var response = {
                    save: lobby.save
                }
                for (var i = 0; i < currentLobby.length; i++) {
                    response.userName = currentLobby[i].name;
                    currentLobby[i].socket.emit("GAME_STARTED", JSON.stringify(response))
                }
            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
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
var http = require("http");
var express = require("express")
var app = express()
const PORT = 3000;

app.use(express.static('static'))
app.use(express.json())
var cookieParser = require("cookie-parser")
app.use(cookieParser())
var path = require('path')

var server = app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

var io = require('socket.io')(server);

var SavesRepository = require("./repositories/SavesRepository.js").SavesRepository
var LobbiesRepository = require("./repositories/LobbiesRepository.js").LobbiesRepository
var SocketRepository = require("./repositories/SocketRepository.js").SocketRepository

var LobbiesService = require("./services/LobbiesService.js").LobbiesService

var SavesService = require("./services/SavesService.js").SavesService;
var SocketService = require("./services/SocketService.js").SocketService;

var lobbiesRepository = new LobbiesRepository();
lobbiesRepository.drop();
var savesRepository = new SavesRepository();
var socketRepository = new SocketRepository();

var lobbiesService = new LobbiesService(lobbiesRepository, socketRepository, savesRepository);
var savesService = new SavesService(savesRepository, socketRepository, lobbiesRepository);
var socketService = new SocketService(socketRepository)

io.on('connection', (socket) => {
    socket.on("JOIN_THE_LOBBY", (msg) => {
        var command = JSON.parse(msg)
        lobbiesService.joinTheLobby(command.lobby, command.name, socket)
    })

    socket.on("CHOOSE_CIVILIZATION", (msg) => {
        var command = JSON.parse(msg);
        lobbiesService.chooseCivilization(command.lobby, command.name, command.civilization, socket)
    });

    socket.on("RENDER_MAP", (msg) => {
        var command = JSON.parse(msg);
        savesService.renderMap(command.lobby, socket)
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
                x.turn += 1;
                var randomisePositions = (x) => {
                    var positions = []
                    x.players.forEach(element => {
                        var randomPosition = {
                            x: Math.floor(Math.random() * x.map.size.width),
                            y: Math.floor(Math.random() * x.map.size.height),
                        }
                        positions.push(randomPosition);
                    });
                    if (Math.sqrt(Math.pow(positions[0].x - positions[1].x, 2) + Math.pow(positions[0].y - positions[1].y, 2)) < 5) {
                        return randomisePositions(x)
                    }
                    return positions;
                }

                var positions = randomisePositions(x);
                positions[0].player = x.players[0];
                positions[1].player = x.players[1];

                for (var i = 0; i < positions.length; i++) {
                    var pos = positions[i]
                    for (var j = 0; j < x.map.tiles.length; j++) {
                        if (x.map.tiles[j].position.x == pos.x && x.map.tiles[j].position.z == pos.y) {

                            x.map.tiles[j].unit = { type: "Settler", owner: pos.player, moves: 2 }
                        }
                    }
                }
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
                console.log(x)
                socket.emit(x, JSON.stringify({}))
            })
    })

    socket.on("JOIN_THE_GAME", async (msg) => {
        var command = JSON.parse(msg);
        await lobbiesService.joinTheGame(command.gameId, msg.username, socket);
    })

    socket.on("MOVE_UNIT", async (msg) => {
        var command = JSON.parse(msg);
        await savesService.moveUnit(command.fromPosition, command.toPosition, command.usedMoves, socket)
    })

    socket.on("NEXT_TURN", async (msg) => {
        savesService.nextTurn(socket);
    })

    socket.on("BUILD_CITY", async (msg) => {
        var command = JSON.parse(msg);
        savesService.buildCity(socket, command.position)
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

app.get("/api/save/:id", async function (req, res) {
    var id = req.params.id;
    var save = await savesRepository.getSingle(id);
    res.send(save);
})

app.get("/api/save/:id/base", async function (req, res) {
    var id = req.params.id;
    var save = await savesRepository.getSingle(id);
    var dto = {
        turn: save.turn,
        map: save.map.size,
        id: save._id,
        lastUpdate: save.lastUpdate
    }
    res.send(dto);
})

app.get("/game/:id/:username", async function (req, res) {
    var id = req.params.id;
    var name = req.params.username;
    res.cookie("game", id, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), httpOnly: false })
    res.cookie("username", name, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), httpOnly: false })
    res.sendFile(path.join(__dirname + "/static/game.html"))
})
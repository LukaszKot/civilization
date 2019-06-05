class SavesService {
    constructor(savesRepository, socketRepository, lobbiesRepository) {
        this._savesRepository = savesRepository;
        this._socketRepository = socketRepository;
        this._lobbiesRepository = lobbiesRepository;
    }

    generateSave() {
        var tiles = []
        var mapSize = {
            width: 25,
            height: 12
        }
        for (var i = 0; i < mapSize.width; i++) {
            for (var j = 0; j < mapSize.height; j++) {
                var tile = {
                    id: mapSize.width * j + i,
                    position: {
                        x: i,
                        z: j
                    },
                }
                tiles.push(tile)
            }
        }
        var save = {
            turn: 0,
            nowPlaying: 0,
            map: {
                size: {
                    width: mapSize.width,
                    height: mapSize.height
                },
                tiles: tiles
            },
            lastUpdate: Date.now()
        }
        return this._savesRepository.insert(save)
    }

    async moveUnit(fromPosition, toPosition, usedMoves, socket) {
        var theSocket = this._socketRepository.getById(socket.id);
        var lobby = this._socketRepository.getSocketsWhereGameIsEqualTo(theSocket.saveId)
        var save = await this._savesRepository.getSingle(theSocket.saveId);
        var tiles = save.map.tiles;
        var from;
        var to;
        tiles.forEach(tile => {
            if (tile.position.x == fromPosition.x && tile.position.z == fromPosition.z) {
                from = tile;
            }
            if (tile.position.x == toPosition.x && tile.position.z == toPosition.z) {
                to = tile;
            }
        });
        to.unit = from.unit;
        from.unit = null;
        to.unit.moves -= usedMoves
        await this._savesRepository.update(save)
        lobby.forEach(s => {
            s.socket.emit("UNIT_MOVED", JSON.stringify({ from: from, to: to, usedMoves: usedMoves }))
        });
    }

    async renderMap(lobbyName, socket) {
        var lobby = await this._lobbiesRepository.getSingle(lobbyName);
        if (lobby == null) {
            socket.emit("LOBBY_DOES_NOT_EXIST", "{}");
            return;
        }
        var currentLobby = this._socketRepository.getSocketsWhereLobbyIsEqualTo(lobbyName)
        var save = await this.generateSave();
        lobby.save = save._id;
        await this._lobbiesRepository.update(lobby)
        var dto = {
            name: lobby.name,
            players: lobby.players,
            save: {
                turn: save.turn,
                map: save.map.size,
                lastUpdate: save.lastUpdate
            }
        }
        currentLobby.forEach(theSocket => {
            theSocket.socket.emit("MAP_RENDERED", JSON.stringify(dto))
        })
    }

    async nextTurn(socket) {
        var theSocket = this._socketRepository.getById(socket.id);
        var currentGame = this._socketRepository.getSocketsWhereGameIsEqualTo(theSocket.saveId);
        var save = await this._savesRepository.getSingle(theSocket.saveId);
        if (save.nowPlaying == 0) {
            save.nowPlaying++;
        }
        else {
            save.nowPlaying--;
            save.turn++;
            save.map.tiles.forEach(tile => {
                if (tile.unit)
                    tile.unit.moves = 2
            })
        }
        await this._savesRepository.update(save);
        currentGame.forEach(element => {
            element.socket.emit("NEXT_TURN_BEGIN", JSON.stringify(save))
        });
    }
}

module.exports = { SavesService }
class SavesService {
    constructor(savesRepository, socketRepository) {
        this._savesRepository = savesRepository;
        this._socketRepository = socketRepository;
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

    async moveUnit(fromPosition, toPosition, socket) {
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
        await this._savesRepository.update(save)
        lobby.forEach(s => {
            s.socket.emit("UNIT_MOVED", JSON.stringify({ from: from, to: to }))
        });
    }
}

module.exports = { SavesService }
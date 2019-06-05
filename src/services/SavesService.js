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
}

module.exports = { SavesService }
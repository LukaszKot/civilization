class LobbiesService {
    constructor(lobbiesRepository, socketRepository) {
        this._lobbiesRepository = lobbiesRepository;
        this._socketRepository = socketRepository;
    }

    async joinTheLobby(lobbyName, name, socket) {
        var lobby = await this._lobbiesRepository.getSingle(lobbyName)
        if (lobby == null) throw "LOBBY_DOES_NOT_EXIST";
        this._socketRepository.insert(name, lobbyName, socket);
        var currentLobby = this._socketRepository.getSocketsWhereLobbyIsEqualTo(lobbyName)
        if (currentLobby.length > 2) {
            this._socketRepository.remove(socket.id)
            socket.emit("LOBBY_IS_ALREADY_FULL", JSON.stringify({}))
            return;
        }
        if (currentLobby.length == 2 && currentLobby[0].name == currentLobby[1].name) {
            this._socketRepository.remove(socket.id)
            socket.emit("GIVEN_NAME_IS_ALREADY_TAKEN", JSON.stringify({}))
            return;
        }
        var player = {
            name: name,
            civilization: null
        }
        lobby.players.push(player)
        await this._lobbiesRepository.update(lobby)
        if (lobby) currentLobby.forEach(theSocket => {
            theSocket.socket.emit("PLAYER_JOINED_THE_LOBBY", JSON.stringify(lobby))
        })
    }

    chooseCivilization(lobbyName, name, civilization, socket) {
        var currentLobby;
        this._lobbiesRepository.getSingle(lobbyName)
            .then(x => {
                if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                currentLobby = this._socketRepository.getSocketsWhereLobbyIsEqualTo(lobbyName)
                var isPlayerExist = false
                for (var i = 0; i < x.players.length; i++) {
                    if (x.players[i].name == name) {
                        isPlayerExist = true;
                        x.players[i].civilization = civilization;
                    }
                }
                if (!isPlayerExist) throw "PLAYER_DOES_NOT_EXIST";
                if (x.players.length > 1 && x.players[0].civilization == x.players[1].civilization && x.players[0].civilization != null) {
                    throw "CIVILIZATION_IS_ALREADY_CHOOSEN"
                }

                return this._lobbiesRepository.update(x)
            })
            .then(x => {
                if (x) currentLobby.forEach(theSocket => {
                    theSocket.socket.emit("CIVILIZATION_CHOOSEN", JSON.stringify(x))
                })
            })
            .catch(x => {
                socket.emit(x, JSON.stringify({}))
            })
    }

    getLobby(lobbyName) {
        return new Promise((accept, reject) => {
            this._lobbiesRepository.getSingle(lobbyName)
                .then(x => {
                    if (x == null) throw "LOBBY_DOES_NOT_EXIST";
                    accept(x)
                })
        })
    }

    attachSaveToLobby(save, lobby) {
        lobby.save = save._id;
        return this._lobbiesRepository.update(lobby)
    }
}

module.exports = { LobbiesService }
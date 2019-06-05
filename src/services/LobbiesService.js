class LobbiesService {
    constructor(lobbiesRepository, socketRepository) {
        this._lobbiesRepository = lobbiesRepository;
        this._socketRepository = socketRepository;
    }

    async joinTheLobby(lobbyName, name, socket) {
        var lobby = await this._lobbiesRepository.getSingle(lobbyName)
        if (lobby == null) {
            socket.emit("LOBBY_DOES_NOT_EXIST", JSON.stringify({}))
            return;
        }

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

    async chooseCivilization(lobbyName, name, civilization, socket) {
        var lobby = await this._lobbiesRepository.getSingle(lobbyName)
        if (lobby == null) {
            socket.emit("LOBBY_DOES_NOT_EXIST", JSON.stringify({}))
            return;
        }
        var currentLobby = this._socketRepository.getSocketsWhereLobbyIsEqualTo(lobbyName)
        var isPlayerExist = false
        for (var i = 0; i < lobby.players.length; i++) {
            if (lobby.players[i].name == name) {
                isPlayerExist = true;
                lobby.players[i].civilization = civilization;
            }
        }
        if (!isPlayerExist) {
            socket.emit("PLAYER_DOES_NOT_EXIST", JSON.stringify({}))
            return;
        }
        if (lobby.players.length > 1 && lobby.players[0].civilization == lobby.players[1].civilization && lobby.players[0].civilization != null) {
            socket.emit("CIVILIZATION_IS_ALREADY_CHOOSEN", JSON.stringify({}))
            return;
        }
        await this._lobbiesRepository.update(lobby)
        currentLobby.forEach(theSocket => {
            theSocket.socket.emit("CIVILIZATION_CHOOSEN", JSON.stringify(lobby))
        })
    }

    async getLobby(lobbyName) {
        var lobby = this._lobbiesRepository.getSingle(lobbyName)
        if (lobby == null) throw "LOBBY_DOES_NOT_EXIST";
        return lobby;
    }

    attachSaveToLobby(save, lobby) {
        lobby.save = save._id;
        return this._lobbiesRepository.update(lobby)
    }
}

module.exports = { LobbiesService }
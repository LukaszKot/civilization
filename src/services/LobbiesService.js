class LobbiesService {
    constructor(lobbiesRepository, socketRepository, savesRepository) {
        this._lobbiesRepository = lobbiesRepository;
        this._socketRepository = socketRepository;
        this._savesRepository = savesRepository;
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

    async joinTheGame(saveId, name, socket) {
        var save = await this._savesRepository.getSingle(saveId);
        if (save == null) {
            socket.emit("GAME_DOES_NOT_EXISTS", JSON.stringify({}))
        }

        var isUsernameOk = false;
        save.players.forEach(player => {
            if (player.name == name) {
                isUsernameOk = true;
            }
        });

        if (!isUsernameOk) {
            socket.emit("INVALID_PLAYER", JSON.stringify({}))
        }

        var currentGame = this._socketRepository.getSocketsWhereGameIsEqualTo(saveId);
        if (currentGame.length >= 2) {
            socket.emit("GAME_IS_FULL", JSON.stringify({}))
        }
        this._socketRepository.insertIntoGame(name, saveId, socket);
        currentGame = this._socketRepository.getSocketsWhereGameIsEqualTo(saveId);
        currentGame.forEach(s => {
            s.socket.emit("PLAYER_JOINED_THE_GAME", JSON.stringify({}))
        });

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
}

module.exports = { LobbiesService }
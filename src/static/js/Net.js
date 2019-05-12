class Net {
    constructor() {
        this._httpClient = new HttpClient();
        this._socketClient = new SocketClient();
    }

    getAllLobbies() {
        return this._httpClient.get("/api/lobbies")
    }

    createLobby(name) {
        var payload = {
            name: name
        }
        return this._httpClient.post("/api/lobbies", payload)
    }

    joinTheLobby(lobbyName, username) {
        var payload = {
            name: username,
            lobby: lobbyName
        }
        this._socketClient.publishCommand("JOIN_THE_LOBBY", payload)
    }

    chooseCivilization(lobbyName, username, civilization) {
        var payload = {
            lobby: lobbyName,
            name: username,
            civilization: civilization
        }
        this._socketClient.publishCommand("CHOOSE_CIVILIZATION", payload)
    }

    renderMap(lobbyName) {
        var payload = {
            lobby: lobbyName
        }
        this._socketClient.publishCommand("RENDER_MAP", payload)
    }

    kickPlayer(lobbyName, playerName) {
        var payload = {
            lobby: lobbyName,
            playerName: playerName
        }
        this._socketClient.publishCommand("KICK_PLAYER", payload)
    }

    startGame(lobbyName) {
        var payload = {
            lobby: lobbyName
        }
        this._socketClient.publishCommand("START_GAME", payload)
    }

    disconnectFromTheLobby() {
        this._socketClient.disconnect();
    }

    onLobbyIsAlreadyFull(callback) {
        this._socketClient.subscribeEvent("LOBBY_IS_ALREADY_FULL", callback)
    }

    onPlayerJoinedTheLobby(callback) {
        this._socketClient.subscribeEvent("PLAYER_JOINED_THE_LOBBY", callback)
    }

    onGivenNameIsAlreadyTaken(callback) {
        this._socketClient.subscribeEvent("GIVEN_NAME_IS_ALREADY_TAKEN", callback)
    }

    onLobbyDoesNotExist(callback) {
        this._socketClient.subscribeEvent("LOBBY_DOES_NOT_EXIST", callback)
    }

    onPlayerDoesNotExist(callback) {
        this._socketClient.subscribeEvent("PLAYER_DOES_NOT_EXIST", callback)
    }

    onCivilizationIsAlreadyChoosen(callback) {
        this._socketClient.subscribeEvent("CIVILIZATION_IS_ALREADY_CHOOSEN", callback)
    }

    onCivilizationChoosen(callback) {
        this._socketClient.subscribeEvent("CIVILIZATION_CHOOSEN", callback)
    }

    onMapRendered(callback) {
        this._socketClient.subscribeEvent("MAP_RENDERED", callback)
    }

    onPlayerDisconnectedFromTheLobby(callback) {
        this._socketClient.subscribeEvent("PLAYER_LEAVED_THE_LOBBY", callback)
    }

    onDisconnectFromTheLobby(callback) {
        this._socketClient.subscribeEvent("disconnect", () => {
            this._socketClient.reconnect();
            callback();
        })
    }

    onHostCannotBeKicked(callback) {
        this._socketClient.subscribeEvent("HOST_CANNOT_BE_KICKED", callback)
    }

    onCivilizationNotSelected(callback) {
        this._socketClient.subscribeEvent("CIVILIZATION_NOT_SELECTED", callback)
    }

}
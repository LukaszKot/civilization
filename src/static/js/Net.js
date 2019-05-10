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

    joinTheLobby(username, lobbyName) {
        var payload = {
            name: username,
            lobby: lobbyName
        }
        this._socketClient.publishCommand("JOIN_THE_LOBBY", payload)
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

    lobbyDoesNotExist(callback) {
        this._socketClient.subscribeEvent("LOBBY_DOES_NOT_EXIST", callback)
    }
}
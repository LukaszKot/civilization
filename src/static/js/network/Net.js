class Net {
    constructor() {
        this._httpClient = new HttpClient();
        this._socketClient = new SocketClient();
        this._userData = {}
    }

    setUsername(username) {
        this._userData.username = username;
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

    joinTheLobby(lobbyName) {
        var payload = {
            name: this._userData.username,
            lobby: lobbyName
        }
        this._socketClient.publishCommand("JOIN_THE_LOBBY", payload)
    }

    chooseCivilization(civilization) {
        var payload = {
            lobby: this._userData.lobbyName,
            name: this._userData.username,
            civilization: civilization
        }
        this._socketClient.publishCommand("CHOOSE_CIVILIZATION", payload)
    }

    renderMap() {
        var payload = {
            lobby: this._userData.lobbyName
        }
        this._socketClient.publishCommand("RENDER_MAP", payload)
    }

    kickPlayer(playerName) {
        var payload = {
            lobby: this._userData.lobbyName,
            playerName: playerName
        }
        this._socketClient.publishCommand("KICK_PLAYER", payload)
    }

    startGame() {
        var payload = {
            lobby: this._userData.lobbyName
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
        this._socketClient.subscribeEvent("PLAYER_JOINED_THE_LOBBY", (event) => {
            this._userData.lobbyName = event.name
            callback(event);
        })
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
            this._userData.lobbyName = null;
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

    onInvalidPlayerNumber(callback) {
        this._socketClient.subscribeEvent("INVALID_PLAYER_NUMBER", callback)
    }

    onSaveNotSelected(callback) {
        this._socketClient.subscribeEvent("SAVE_NOT_SELECTED", callback)
    }

    onGameStarted(callback) {
        this._socketClient.subscribeEvent("GAME_STARTED", callback)
    }

    getSave(id) {
        return this._httpClient.get("/api/save/" + id)
    }

    getSaveBaseInfo(id) {
        return this._httpClient.get("/api/save/" + id + "/base")
    }

    joinTheGame(gameId, username) {
        this.setUsername(username)
        this._socketClient.publishCommand("JOIN_THE_GAME", { gameId: gameId, username: username })
    }

    onPlayerJoinedTheGame(callback) {
        this._socketClient.subscribeEvent("PLAYER_JOINED_THE_GAME", callback)
    }

    moveUnit(fromPosition, toPosition, usedMoves) {
        this._socketClient.publishCommand("MOVE_UNIT", { fromPosition: fromPosition, toPosition: toPosition, usedMoves: usedMoves })
    }

    onUnitMoved(callback) {
        this._socketClient.subscribeEvent("UNIT_MOVED", callback)
    }

    nextTurn() {
        this._socketClient.publishCommand("NEXT_TURN", {})
    }

    onNextTurnBegin(callback) {
        this._socketClient.subscribeEvent("NEXT_TURN_BEGIN", callback);
    }

}
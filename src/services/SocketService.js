class SocketService {
    constructor(socketRepository) {
        this._socketRepository = socketRepository;
    }

    getSocketsWhereLobbyIsEqualTo(lobbyName) {
        return this._socketRepository.getSocketsWhereLobbyIsEqualTo(lobbyName)
    }
}

module.exports = { SocketService }
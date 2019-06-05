class SocketRepository {
    constructor() {
        this.sockets = [];
    }

    insertIntoGame(username, gameId, socket) {
        var socketObject = {
            socket: socket,
            name: username,
            saveId: gameId
        }
        this.sockets.push(socketObject)
    }

    getSocketsWhereGameIsEqualTo(id) {
        var socketsGroup = []
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].saveId == id) {
                socketsGroup.push(this.sockets[i])
            }
        }
        return socketsGroup;
    }

    insert(username, lobbyName, socket) {
        var socketObject = {
            socket: socket,
            name: username,
            lobby: lobbyName
        }
        this.sockets.push(socketObject)
    }

    getSocketsWhereLobbyIsEqualTo(lobbyName) {
        var socketsGroup = []
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].lobby == lobbyName) {
                socketsGroup.push(this.sockets[i])
            }
        }
        return socketsGroup;
    }

    getById(id) {
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].socket.id == id) return this.sockets[i]
        }
    }

    remove(socketId) {
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].socket.id == socketId) {
                this.sockets.splice(i, 1);
                return;
            }
        }
    }
}

module.exports = { SocketRepository }
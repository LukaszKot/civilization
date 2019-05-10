class SocketClient {
    constructor() {
        this._socket = io();
    }

    publishCommand(commandName, command) {
        var msg = JSON.stringify(command);
        this._socket.emit(commandName, msg)
    }

    subscribeEvent(eventName, callback) {
        this._socket.on(eventName, (msg) => {
            var event = JSON.parse(msg)
            callback(event)
        })
    }
}
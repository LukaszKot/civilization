class SocketClient {
    constructor() {
        this._socket = io();
    }

    publishCommand(commandName, command) {
        var msg = JSON.stringify(command);
        this._socket.emit(commandName, msg)
    }

    subscribeEvent(eventName, callback) {
        this._socket.off(eventName)
        this._socket.on(eventName, (msg) => {
            var event;
            try {
                event = JSON.parse(msg)
            }
            catch{
                event = {}
            }

            callback(event)
        })
    }

    disconnect() {
        this._socket.disconnect();
    }

    reconnect() {
        this._socket = io();
    }
}
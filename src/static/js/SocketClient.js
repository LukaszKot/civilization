class SocketClient {
    constructor() {
        this._socket = io();
        this._registrations = []
    }

    publishCommand(commandName, command) {
        var msg = JSON.stringify(command);
        this._socket.emit(commandName, msg)
    }

    subscribeEvent(eventName, callback) {
        this._registrations.push({
            eventName: eventName,
            callback: callback
        })
        this._socket.on(eventName, (msg) => {
            var event = JSON.parse(msg)
            callback(event)
        })
    }

    disconnect() {
        this._socket.disconnect();
    }

    reconnect() {
        this._socket = io();
        console.log(this._registrations)
        for (let i = 0; i < this._registrations.length; i++) {
            this._socket.on(this._registrations[i].eventName, (msg) => {
                var event = JSON.parse(msg)
                this._registrations[i].callback(event)
            })
        }
    }
}
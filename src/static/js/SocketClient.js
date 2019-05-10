class SocketClient {
    constructor() {
    }

    establishConnection() {
        this._socket = io();
    }
}
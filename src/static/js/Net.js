class Net {
    constructor() {
        this._httpClient = new HttpClient();
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
}
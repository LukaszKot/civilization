class Net {
    constructor() {
        this._httpClient = new HttpClient();
    }

    getAllLobbies() {
        return this._httpClient.get("/api/lobbies")
    }
}
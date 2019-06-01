class LobbiesView {
    constructor() {
    }

    render() {
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "nameOfGame").html("Civilization VII"))
            .append($("<p>").attr("id", "nameOfLobbys").addClass("names").html("Lista lobby"))
            .append($("<p>").attr("id", "nameOfMenu").addClass("names").html("Menu"))
        main.append(this.menu)
        this._createListOfLobbys();
        this._createInternalMenu();
        var x = 10;
        var y = 10;
        var time = 10;
        var date = 10;
        this._createSaveInfo(x, y, time, date);
    }

    _createListOfLobbys() {
        this.listOfLobbys = $("<div>").attr("id", "listOfLobbys")
        this.menu.append(this.listOfLobbys);
        net.getAllLobbies()
            .then(lobbies => {
                this.lobbys = lobbies;
                this._addingLobbys();
            })

    }

    _createInternalMenu() {
        this.newGameButton = $("<button>").attr("id", "newGame")
            .addClass("menuButtons")
            .html("Nowa Gra")
            .on("click", () => {
                var lobby = prompt("Podaj nazwę lobby:")
                net.createLobby(lobby)
                    .then(lobby => {
                        if (lobby.event == "LOBBY_WITH_THAT_NAME_ALREADY_EXISTS") {
                            alert("Lobby o takiej nazwie już istnieje.")
                        }
                        if (lobby.event == "LOBBY_CREATED") {
                            lobbyView.render(lobby.body.name)
                        }
                    })
            })
        this.backButton = $("<button>").attr("id", "back")
            .addClass("menuButtons")
            .html("Powrót")
            .on("click", () => {
                menuView.render()
            })
        this.exitButton = $("<button>").attr("id", "exit")
            .addClass("menuButtons")
            .html("Odśwież")
            .on("click", () => {
                this.render();
            })


        var internalMenu = $("<div>").attr("id", "internalMenu")
            .append(this.newGameButton)
            .append(this.backButton)
            .append(this.exitButton)
        this.menu.append(internalMenu);
    }

    _createSaveInfo(x, y, time, date) {
        this.nameSaveInfo = $("<div>").attr("id", "nameSaveInfo")
            .addClass("saveInfo")
            .html("Informacje o save:")
        this.timeInfo = $("<div>").attr("id", "time")
            .addClass("saveInfo")
            .html("Obecna tura : " + time)
        this.mapInfo = $("<div>").attr("id", "map")
            .addClass("saveInfo")
            .html("Rozmiar mapy to : " + x + " hexów na " + y + " hexów")
        this.br = $("<br>")
        this.dateInfo = $("<div>").attr("id", "date")
            .addClass("saveInfo")
            .html("Obecna data to : " + date)

        var saveInfo = $("<div>").attr("id", "saveInfo")
            .append(this.nameSaveInfo)
            .append(this.mapInfo)
            .append(this.br)
            .append(this.timeInfo)
            .append(this.dateInfo)
        this.menu.append(saveInfo);
    }

    _addingLobbys() {
        for (let i = 0; i < this.lobbys.length; i++) {
            this.nextLobbyId = $("<div>")
                .addClass("lobbyId")
                .html("Nazwa:" + this.lobbys[i].name)
            this.nextLobbyValue = $("<div>")
                .addClass("lobbyValue")
                .html("Liczba graczy:" + this.lobbys[i].players)
            this.nextLobbyButton = $("<button>").attr("id", "savedGame")
                .addClass("lobbyButton")
                .html("Dołącz")
                .on("click", () => {
                    lobbyView.render(this.lobbys[i].name)
                })
            var nextLobby = $("<div>").addClass("nextLobby")
                .append(this.nextLobbyId)
                .append(this.nextLobbyValue)
                .append(this.nextLobbyButton)
            this.listOfLobbys
                .append(nextLobby)
        }
    }
}

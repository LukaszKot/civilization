class LobbysView {
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
    }

    _createListOfLobbys() {
        this.listOfLobbys = $("<div>").attr("id", "listOfLobbys")
        this.menu.append(this.listOfLobbys);
        this._addingLobbys();
    }

    _createInternalMenu() {
        this.newGameButton = $("<button>").attr("id", "newGame")
            .addClass("menuButtons")
            .html("Nowa Gra")
        this.backButton = $("<button>").attr("id", "back")
            .addClass("menuButtons")
            .html("Powrót")
            .on("click", () => {
                menuView.render()
            })
        this.exitButton = $("<button>").attr("id", "exit")
            .addClass("menuButtons")
            .html("Wyjście")
            .on("click", () => {
                close();
            })


        var internalMenu = $("<div>").attr("id", "internalMenu")
            .append(this.newGameButton)
            .append(this.backButton)
            .append(this.exitButton)
        this.menu.append(internalMenu);
    }

    _addingLobbys() {
        this.lobbys = [
            { name: "Pierwsze", creator: "Halpon", players: 2 },
            { name: "Drugie", creator: "MisterCodePL", players: 2 }
        ]
        for (var i = 0; i < this.lobbys.length; i++) {
            this.nextLobbyId = $("<div>")
                .addClass("lobbyId")
                .html("Nazwa:" + this.lobbys[i].name)
            this.nextLobbyNick = $("<div>")
                .addClass("lobbyNick")
                .html("Twórca:" + this.lobbys[i].creator)
            this.nextLobbyValue = $("<div>")
                .addClass("lobbyValue")
                .html("Liczba graczy:" + this.lobbys[i].players)
            this.nextLobbyButton = $("<button>").attr("id", "savedGame")
                .addClass("lobbyButton")
                .html("Dołącz")
                .on("click", () => {
                    lobbyView.render()
                })
            var nextLobby = $("<div>").addClass("nextLobby")
                .append(this.nextLobbyId)
                .append(this.nextLobbyNick)
                .append(this.nextLobbyButton)
                .append(this.nextLobbyValue)
            this.listOfLobbys
                .append(nextLobby)
        }
    }
}

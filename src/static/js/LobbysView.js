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
                displayingAlert.lobbysViewAlert();
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

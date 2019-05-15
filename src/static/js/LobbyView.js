class LobbyView {
    constructor() {
    }

    render(lobbyName) {
        net.joinTheLobby(lobbyName)
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "nameOfGame").html("Civilization VII"))
            .append($("<p>").attr("id", "nameOfPlayers").addClass("names").html("Lista graczy"))
            .append($("<p>").attr("id", "nameOfMenu").addClass("names").html("Menu"))
        main.append(this.menu)
        this._createListOfPlayers();
        this._createInternalMenu();
        this._addEventListiners()
    }

    _addEventListiners() {
        net.onPlayerJoinedTheLobby((event) => {
            this._addingPlayers(event.players);
        })
        net.onLobbyDoesNotExist(() => {
            lobbysView.render();
            alert("Lobby nie istnieje!")
        })
        net.onLobbyIsAlreadyFull(() => {
            lobbysView.render();
            alert("Lobby jest już pełne!")
        })
        net.onGivenNameIsAlreadyTaken(() => {
            loginningView.render();
            alert("Gracz o takim nicku już jest w lobby!")
        })
        net.onDisconnectFromTheLobby(() => {
            lobbysView.render();
            alert("Zostałeś wyrzucony z lobby!")
        })
        net.onPlayerDisconnectedFromTheLobby((event) => {
            this._addingPlayers(event.players);
        })
    }

    _createListOfPlayers() {
        this.listOfPlayers = $("<div>").attr("id", "listOfPlayers")
        this.menu.append(this.listOfPlayers);
    }

    _createInternalMenu() {
        this.newGameButton = $("<button>").attr("id", "startGame")
            .addClass("menuButtons")
            .html("Start")
        this.savedGameButton = $("<button>").attr("id", "settingsButton")
            .addClass("menuButtons")
            .html("Ustawienia")
        this.backButton = $("<button>").attr("id", "back")
            .addClass("menuButtons")
            .html("Powrót")
            .on("click", () => {
                net.disconnectFromTheLobby();
                lobbysView.render()
            })

        var internalMenu = $("<div>").attr("id", "internalMenu")
            .append(this.newGameButton)
            .append(this.savedGameButton)
            .append(this.backButton)
        this.menu.append(internalMenu);
    }

    _creatingListOfCivs() {
        this.civs = ["USA", "ROSJA"]
        this.nextPlayerCiv = $("<select>")
            .addClass("chosingCivs")
        for (var i = 0; i < this.civs.length; i++) {
            this.addingCivs = $("<option>")
                .html(this.civs[i])
            this.nextPlayerCiv.append(this.addingCivs)
        }

    }

    _addingPlayers(players) {
        this.players = players
        this.listOfPlayers
            .empty()
        for (var i = 0; i < this.players.length; i++) {
            this.nextPlayerId = $("<div>")
                .addClass("playerId")
                .html("Lp. " + (i + 1))
            this.nextPlayerNick = $("<div>")
                .addClass("playerNick")
                .html("Nick: " + this.players[i].name)
            this.nextCivName = $("<div>")
                .addClass("civName")
                .html("Cywilizacja: ")
            this._creatingListOfCivs();
            var nextPlayer = $("<div>").addClass("nextPlayer")
                .append(this.nextPlayerId)
                .append(this.nextPlayerNick)
                .append(this.nextPlayerCiv)
                .append(this.nextCivName)
            this.listOfPlayers
                .append(nextPlayer)
        }
    }
}


class LobbyView {
    constructor() {
    }

    render() {
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "nameOfGame").html("Civilization VII"))
            .append($("<p>").attr("id", "nameOfPlayers").addClass("names").html("Lista graczy"))
            .append($("<p>").attr("id", "nameOfMenu").addClass("names").html("Menu"))
        main.append(this.menu)
        this._createListOfPlayers();
        this._createInternalMenu();
    }

    _createListOfPlayers() {
        this.listOfPlayers = $("<div>").attr("id", "listOfPlayers")
        this.menu.append(this.listOfPlayers);
        this._addingPlayers();
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

    _addingPlayers() {
        this.players = [
            { id: 1, nick: "Halpon" },
            { id: 2, nick: "MisterCodePL" }
        ]
        for (var i = 0; i < this.players.length; i++) {
            this.nextPlayerId = $("<div>")
                .addClass("playerId")
                .html("Lp. " + this.players[i].id)
            this.nextPlayerNick = $("<div>")
                .addClass("playerNick")
                .html("Nick: " + this.players[i].nick)
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


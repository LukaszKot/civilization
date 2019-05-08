class LobbyView {
    constructor() {
    }

    render() {
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "name1").html("Civilization VII"))
            .append($("<p>").attr("id", "name2").addClass("name").html("Lista graczy"))
            .append($("<p>").attr("id", "name3").addClass("name").html("Menu"))
        this._createListOfPlayers();
        this._createInterialMenu();
        main.append(this.menu)
    }

    _createListOfPlayers() {
        this.listOfPlayers = $("<div>").attr("id", "list_of_players")
        this.menu.append(this.listOfPlayers);
        this._addingPlayers();
    }

    _createInterialMenu() {
        this.newGameButton = $("<button>").attr("id", "new_game")
            .addClass("menu_buttons")
            .html("Nowa Gra")
        this.savedGameButton = $("<button>").attr("id", "saved_game")
            .addClass("menu_buttons")
            .html("Wczytaj Grę")

        var interialMenu = $("<div>").attr("id", "interial_menu")
            .append(this.newGameButton)
            .append(this.savedGameButton)
        this.menu.append(interialMenu);
    }

    _addingPlayers() {
        this.players = [
            { id: 1, nick: "Halpon" },
            { id: 2, nick: "MisterCodePL" }
        ]
        for (var i = 0; i < this.players.length; i++) {
            this.nextPlayerId = ("<div>")
                .addClass("playerId")
                .html("Lp. " + this.players[i].id)
            this.nextPlayerNick = ("<div>")
                .addClass("playerNick")
                .html("Nick: " + this.players[i].nick)

            var nextPlayer = $("<div>").addClass("nextPlayer")
                .append(this.nextPlayerId)
                .append(this.nextPlayerNick)

            this.listOfPlayers
                .append(nextPlayer)
        }
    }
}
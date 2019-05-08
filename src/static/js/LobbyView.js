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
        //
        this._createListOfPlayers();
        this._createInterialMenu();
        main.append(this.menu)
        $(".name")
            .css("color", "gold")
            .css("font-size", "50px")
            .css("position", "absolute")
            .css("top", "17%")
            .css("font-family", "fantasy")
        $(".menu_buttons")
            .css("font-family", "fantasy")
            .css("color", "gold")
            .css("font-size", "40px")
            .css("position", "absolute")
            .css("background-color", "rgba(192, 192, 192, 0.6)")
        //
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
        //
        //
    }

    _addingPlayers() {
        this.players = [
            { id: 1, nick: "Halpon" },
            { id: 2, nick: "MisterCodePL" }
        ]
        for (var i = 0; i < this.players.length; i++) {
            this.listOfPlayers
                .append("<div id='player_" + (i + 1) + "'></div>")
            $("#player_" + (i + 1))
                .css("color", "silver")
                .append("<p id='player_lp_" + (i + 1) + "'>Lp.: " + this.players[i].id + "</p>")
                .append("<p id='player_nick_" + (i + 1) + "'>Nick: " + this.players[i].nick + "</p>")
            $("#player_lp_" + (i + 1))
                .css("position", "absolute")
                .css("top", ((i + 1) * 5) + "%")
                .css("right", "5%")
                .css("font-family", "Courier New")
            $("#player_nick_" + (i + 1))
                .css("position", "absolute")
                .css("top", ((i + 1) * 5) + "%")
                .css("left", "5%")
                .css("font-family", "Courier New")
        }
    }
}
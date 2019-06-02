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
            displayingAlert.createTextAlert("Lobby nie istnieje!", "Okay")
        })
        net.onLobbyIsAlreadyFull(() => {
            lobbysView.render();
            displayingAlert.createTextAlert("Lobby jest już pełne!", "Okay")
        })
        net.onGivenNameIsAlreadyTaken(() => {
            loginningView.render();
            displayingAlert.createTextAlert("Gracz o takim nicku już jest w lobby!", "Okay")
        })
        net.onDisconnectFromTheLobby(() => {
            lobbysView.render();
            displayingAlert.createTextAlert("Opuściłeś lobby!", "Okay")
        })
        net.onPlayerDisconnectedFromTheLobby((event) => {
            this._addingPlayers(event.players);
        })

        net.onCivilizationChoosen((event) => {
            for (var i = 0; i < this.selects.length; i++) {
                var civOnServer = event.players[i].civilization
                var toSet = civOnServer == null ? "Brak" : civOnServer
                this.selects[i].val(toSet)
            }
        })

        net.onCivilizationIsAlreadyChoosen(() => {
            this.yourCivSelect.val('Brak')
            net.chooseCivilization(null)
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
            .on("click", () => {
                displayingAlert.createMapAlert("Wybór mapy :", "Stwórz nową")
            })
        this.backButton = $("<button>").attr("id", "back")
            .addClass("menuButtons")
            .html("Powrót")
            .on("click", () => {
                net.disconnectFromTheLobby();
            })

        var internalMenu = $("<div>").attr("id", "internalMenu")
            .append(this.newGameButton)
            .append(this.savedGameButton)
            .append(this.backButton)
        this.menu.append(internalMenu);
    }

    _creatingListOfCivs(isDisabled) {
        this.civs = ["Brak", "USA", "ROSJA"]
        this.nextPlayerCiv = $("<select>")
            .addClass("chosingCivs")
            .on('change', (event) => {
                var val = $(event.currentTarget).val();
                var civilization = val == "Brak" ? null : val;
                net.chooseCivilization(civilization)
            })
        if (isDisabled) {
            this.nextPlayerCiv
                .attr('disabled', 'disabled')
        }
        else {
            this.yourCivSelect = this.nextPlayerCiv;
        }
        this.selects.push(this.nextPlayerCiv);
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
        this.selects = []
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
            var isDisabled = net._userData.username != this.players[i].name
            this._creatingListOfCivs(isDisabled);
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


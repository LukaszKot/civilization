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
        this._addEventListiners();
        this._createSaveInfo(null);
    }

    _addEventListiners() {
        net.onPlayerJoinedTheLobby(async (event) => {
            this._addingPlayers(event.players);
            if (event.save) {
                var save = await net.getSaveBaseInfo(event.save)
                this._createSaveInfo({ save: save });
            }
        })
        net.onLobbyDoesNotExist(() => {
            lobbiesView.render();
            myAlert.createTextAlert("Lobby nie istnieje!", "Okay")
        })
        net.onLobbyIsAlreadyFull(() => {
            lobbiesView.render();
            myAlert.createTextAlert("Lobby jest już pełne!", "Okay")
        })
        net.onGivenNameIsAlreadyTaken(() => {
            loginView.render();
            myAlert.createTextAlert("Gracz o takim nicku już jest w lobby!", "Okay")
        })
        net.onDisconnectFromTheLobby(() => {
            lobbiesView.render();
            myAlert.createTextAlert("Opuściłeś lobby!", "Okay")
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

        net.onMapRendered((data) => {
            this._createSaveInfo(data);
        })

        net.onCivilizationNotSelected(() => {
            myAlert.createTextAlert("Nie wybrano cywilizacji!", "Okay");
        })

        net.onInvalidPlayerNumber(() => {
            myAlert.createTextAlert("W lobby jest nie właściwa liczba graczy!", "Okay");
        })

        net.onSaveNotSelected(() => {
            myAlert.createTextAlert("Nie wybrano/stworzono zapisu gry!", "Okay");
        })

        net.onGameStarted((event) => {
            document.cookie = "gameData=" + JSON.stringify(event) + "; expires=" + (new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)).toUTCString() + "; path=/;"
            window.location.replace("/game.html")
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
            .on("click", () => {
                net.startGame();
            })
        this.savedGameButton = $("<button>").attr("id", "settingsButton")
            .addClass("menuButtons")
            .html("Ustawienia")
            .on("click", () => {
                myAlert.createMapAlert("Wybór mapy :", "Stwórz nową")
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

    _createSaveInfo(saveData) {
        $("#saveInfo").remove();
        this.nameSaveInfo = $("<div>").attr("id", "nameSaveInfo")
            .addClass("saveInfo")
            .html("Informacje o zapisie:")
        var saveInfo = $("<div>").attr("id", "saveInfo")
            .append(this.nameSaveInfo)
        if (saveData == null) {
            var info = $("<div>").attr("id", "nameSaveInfo")
                .addClass("saveInfo").html("Brak zapisu");
            saveInfo.append(info)
        }
        else {
            var x = saveData.save.map.width;
            var y = saveData.save.map.height;
            var turn = saveData.save.turn;
            var saveDate = new Date(saveData.save.lastUpdate);
            var dateString = saveDate.getDate() + "/" + (saveDate.getMonth() + 1)
                + "/" + saveDate.getFullYear() + " " + ("0" + saveDate.getHours()).slice(-2)
                + ":" + ("0" + saveDate.getMinutes()).slice(-2)
                + ":" + ("0" + saveDate.getSeconds()).slice(-2);

            this.timeInfo = $("<div>").attr("id", "time")
                .addClass("saveInfo")
                .html("Obecna tura : " + turn)
            this.mapInfo = $("<div>").attr("id", "map")
                .addClass("saveInfo")
                .html("Rozmiar mapy: " + x + "x" + y)
            this.br = $("<br>")
            this.dateInfo = $("<div>").attr("id", "date")
                .addClass("saveInfo")
                .html("Ostatnia zmiana: " + dateString)

            saveInfo
                .append(this.mapInfo)
                .append(this.br)
                .append(this.timeInfo)
                .append(this.dateInfo)
        }
        this.menu.append(saveInfo);
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


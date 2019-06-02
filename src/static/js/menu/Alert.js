class Alert {
    constructor() {
    }
    createAlert(importedTextInAlert) {
        var textInAlertButton = "Np. Utwórz"
        var main = $("#main")
        var alertText = $("<p>")
            .attr("id", "alertText")
            .addClass("alert")
            .html(importedTextInAlert)
        var alertInput = $("<input>")
            .attr("type", "text")
            .attr("name", "alertInput")
            .attr("id", "alertInput")
            .addClass("alert")
        var alertButton = $("<button>")
            .attr("id", "alertButton")
            .addClass("alert")
            .html(textInAlertButton)
            .on("click", () => {
                this.valueOfAlert = $("#alertInput").val()
                $(".alert").remove()
            })
        var alert = $("<div>").attr("id", "alert")
            .addClass("alert")
            .append(alertText)
            .append(alertInput)
            .append(alertButton)
        main.append(alert)
    }
    lobbysViewAlert() {
        var LobbysViewAlertText = "Podaj nazwe lobby :"
        this.createAlert(LobbysViewAlertText)
        $("#alertButton")
            .on("click", () => {
                var lobby = this.valueOfAlert
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
    }
    createTextAlert(importedTextInAlert, importedButtonInAlert) {
        var textInAlertButton = importedButtonInAlert
        var main = $("#main")
        var alertText = $("<p>")
            .attr("id", "alertText")
            .addClass("alert")
            .html(importedTextInAlert)
        var alertButton = $("<button>")
            .attr("id", "alertButton")
            .addClass("alert")
            .html(textInAlertButton)
            .on("click", () => {
                $(".alert").remove();
            })
        var alert = $("<div>").attr("id", "alert")
            .addClass("alert")
            .append(alertText)
            .append(alertButton)
        main.append(alert)
    }

    createMapAlert(importedTextInAlert, importedButtonInAlert) {
        var textInAlertButton = importedButtonInAlert
        var main = $("#main")
        var alertText = $("<p>")
            .attr("id", "alertText")
            .addClass("alert")
            .html(importedTextInAlert)
        this.maps = ["Pierwsza", "Druga"]
        this.nextMap = $("<select>")
            .css("color", "black")
            .attr("name", "alertLoadSelect")
            .attr("id", "alertLoadSelect")
            .addClass("alert")
        for (var i = 0; i < this.maps.length; i++) {
            this.addingMaps = $("<option>")
                .html(this.maps[i])
            this.nextMap.append(this.addingMaps)
        }
        var alertButtonOne = $("<button>")
            .attr("id", "alertButton")
            .addClass("alert")
            .html("Wczytaj")
            .on("click", () => {
                $(".alert").remove();
            })
        var alertButton = $("<button>")
            .attr("id", "alertButton")
            .addClass("alert")
            .html(textInAlertButton)
            .on("click", () => {
                net.renderMap();
                $(".alert").remove();
            })
        var alert = $("<div>").attr("id", "alert")
            .css("height", "37vh")
            .addClass("alert")
            .append(alertText)
            .append(this.nextMap)
            .append(alertButtonOne)
            .append("<br>")
            .append(alertButton)
        main.append(alert)
    }
}
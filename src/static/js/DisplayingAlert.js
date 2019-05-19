class DisplayingAlert {
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
    lobbysViewAlert(valueOfAlert) {
        var LobbysViewAlertText = "Podaj nazwe lobby :"
        displayingAlert.createAlert(LobbysViewAlertText)
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
}
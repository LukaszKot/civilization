var net;
$(document).ready(function () {
    net = new Net();

    net.onLobbyIsAlreadyFull(event => {
        console.log("lobby is full")
    })

    net.onPlayerJoinedTheLobby(event => {
        console.log("player joined the lobby")
        console.log(event)
    })

    net.onGivenNameIsAlreadyTaken(event => {
        console.log("given name is already taken")
    })

    net.onLobbyDoesNotExist(event => {
        console.log("lobby does not exist")
    })

    net.onPlayerDoesNotExist(event => {
        console.log("player does not exist")
    })

    net.onCivilizationIsAlreadyChoosen(event => {
        console.log("civilization is already choosen")
    })

    net.onCivilizationChoosen(event => {
        console.log("civilization choosen")
        console.log(event)
    })

    net.onMapRendered(event => {
        console.log("map rendered")
        console.log(event)
    })

    net.onPlayerDisconnectedFromTheLobby(event => {
        console.log("player disconnected from the lobby")
        console.log(event)
    })

    net.onDisconnectFromTheLobby(() => {
        console.log("you have been disconnected from the lobby")
    })

    net.onHostCannotBeKicked(() => {
        console.log("host cannot be kicked")
    })

    net.onCivilizationNotSelected(() => {
        console.log("civilization not selected")
    })

    net.onInvalidPlayerNumber(() => {
        console.log("invalid player number")
    })

    net.onSaveNotSelected(() => {
        console.log("save not selected")
    })

    net.onGameStarted(() => {
        console.log("game started")
    })
})
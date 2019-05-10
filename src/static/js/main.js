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

    net.lobbyDoesNotExist(event => {
        console.log("lobby does not exist")
    })
})
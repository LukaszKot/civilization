var net;
var menuView;
var lobbyView;
var lobbysView;
var loginningView;
var displayingAlert;
$(document).ready(function () {
    net = new Net();
    displayingAlert = new DisplayingAlert();
    menuView = new MenuView();
    lobbyView = new LobbyView();
    lobbysView = new LobbysView();
    loginningView = new LoginningView();
    loginningView.render();
})
var net;
var menuView;
var lobbyView;
var lobbysView;
var loginningView;
$(document).ready(function () {
    net = new Net();
    menuView = new MenuView();
    lobbyView = new LobbyView();
    lobbysView = new LobbysView();
    loginningView = new LoginningView();
    loginningView.render();
})
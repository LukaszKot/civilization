var net;
var menuView;
var lobbyView;
var lobbiesView;
var loginView;
$(document).ready(function () {
    net = new Net();
    menuView = new MenuView();
    lobbyView = new LobbyView();
    lobbiesView = new LobbiesView();
    loginView = new LoginView();
    loginView.render();
})
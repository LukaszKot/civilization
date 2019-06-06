var net;
var menuView;
var lobbyView;
var lobbiesView;
var loginView;
var myAlert;
$(document).ready(function () {
    net = new Net();
    myAlert = new Alert();
    menuView = new MenuView();
    lobbyView = new LobbyView();
    lobbiesView = new LobbiesView();
    loginView = new LoginView();
    loginView.render();
})
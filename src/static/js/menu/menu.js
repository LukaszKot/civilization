var net;
var menuView;
var lobbyView;
var lobbiesView;
var loginView;
var displayingAlert;
$(document).ready(function () {
    net = new Net();
    displayingAlert = new DisplayingAlert();
    menuView = new MenuView();
    lobbyView = new LobbyView();
    lobbiesView = new LobbiesView();
    loginView = new LoginView();
    loginView.render();
})
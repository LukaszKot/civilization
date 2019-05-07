$(document).ready(function () {
    main_function = new main_function()
    adding_players = new adding_players()
})
function main_function() {
    $("#main")
        .html("<div id='menu'></div>")
    $("#menu")
        .append("<div id='list_of_players'></div>")
    $("#menu")
        .append("<div id='interial_menu'></div>")
    $("#main")
        .append("<p id='name1'>Civilization VII</p>")
        .append("<p id='name2' class='name'>Lista graczy</p>")
        .append("<p id='name3' class='name'>Menu</p>")
    $(".name")
        .css("color", "gold")
        .css("font-size", "50px")
        .css("position", "absolute")
        .css("top", "17%")
        .css("font-family", "fantasy")
    $("#interial_menu")
        .append("<button id='new_game' class='menu_buttons'>Nowa Gra</button>")
        .append("<button id='saved_game' class='menu_buttons'>Wczytaj Grę</button>")
    $(".menu_buttons")
        .css("font-family", "fantasy")
        .css("color", "gold")
        .css("font-size", "40px")
        .css("position", "absolute")
        .css("background-color", "rgba(192, 192, 192, 0.6)")
}
function adding_players() {
    var players = [
        { id: 1, nick: "Halpon" },
        { id: 2, nick: "MisterCodePL" }
    ]
    for (var i = 0; i < players.length; i++) {
        $("#list_of_players")
            .append("<div id='player_" + (i + 1) + "'></div>")
        $("#player_" + (i + 1))
            .css("color", "silver")
            .append("<p id='player_lp_" + (i + 1) + "'>Lp.: " + players[i].id + "</p>")
            .append("<p id='player_nick_" + (i + 1) + "'>Nick: " + players[i].nick + "</p>")
        $("#player_lp_" + (i + 1))
            .css("position", "absolute")
            .css("top", ((i + 1) * 5) + "%")
            .css("right", "5%")
            .css("font-family", "Courier New")
        $("#player_nick_" + (i + 1))
            .css("position", "absolute")
            .css("top", ((i + 1) * 5) + "%")
            .css("left", "5%")
            .css("font-family", "Courier New")
    }
}
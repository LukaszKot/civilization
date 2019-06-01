class LoginView {
    constructor() {
    }

    render() {
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "nameOfGame").html("Civilization VII"))
            .append($("<p>").attr("id", "nameOfLoginningMenu").html("Podaj swój nickname :"))
        main.append(this.menu)
        this._createLoginningMenu();
    }

    _createLoginningMenu() {


        this.nickName = $("<form>")
            .addClass("loginningMenuFields")
            .attr("id", "nickname")
        this.addingNickname = $("<input>")
            .addClass("loginningMenuFields")
            .attr("id", "nicknameField")
            .attr("type", "text")
            .attr("name", "nickname")
        this.nickName.append(this.addingNickname)

        this.newLoginSubmitButton = $("<button>").attr("id", "loginSubmitButton")
            .addClass("loginningMenuFields")
            .addClass("loginningMenuButtons")
            .html("Dalej")
            .on("click", () => {
                var playerNick = $("#nicknameField").val()
                net.setUsername(playerNick)
                menuView.render()
            })
        this.exitButton = $("<button>").attr("id", "exit")
            .addClass("loginningMenuFields")
            .addClass("loginningMenuButtons")
            .html("Wyjście")
            .on("click", () => {
                window.close();
            })

        var loginningMenu = $("<div>").attr("id", "mainMenu")
            .append(this.nickName)
            .append(this.newLoginSubmitButton)
            .append(this.exitButton)
        this.menu.append(loginningMenu);
    }
}


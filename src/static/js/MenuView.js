class MenuView {
    constructor() {
    }

    render() {
        var main = $("#main")
        main.empty();

        this.menu = $("<div>").attr("id", "menu")
            .append($("<p>").attr("id", "nameOfGame").html("Civilization VII"))
            .append($("<p>").attr("id", "nameOfMainMenu").html("Menu"))
        main.append(this.menu)
        this._createMainMenu();
    }

    _createMainMenu() {
        this.newGameButton = $("<button>").attr("id", "newGame")
            .addClass("mainMenuButtons")
            .html("Gra")
            .on("click", () => {
                console.log("render")
                lobbysView.render()
            })
        this.exitButton = $("<button>").attr("id", "exit")
            .addClass("mainMenuButtons")
            .html("Wyjście")
            .on("click", () => {
                close();
            })

        var mainMenu = $("<div>").attr("id", "mainMenu")
            .append(this.newGameButton)
            .append(this.exitButton)
        this.menu.append(mainMenu);
    }
}


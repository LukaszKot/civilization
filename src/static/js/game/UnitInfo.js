class UnitInfo {
    constructor() {
        this.data = null;
    }

    display() {
        $(".unit-info").css("display", "block")
    }

    hide() {
        $(".unit-info").css("display", "none")
    }

    setData(data) {
        if (data.logicData.type == "City") {
            if (data.logicData.turnToTheEnd) {
                $(".unit-data").html("Pozostało " + data.logicData.turnToTheEnd + " tur do końca budowania jednostki: " + data.logicData.production)
            }
            else {
                $(".unit-data").html("Nic nie produkuje")
            }
        }
        else {
            $(".unit-data").html("Pozostało " + data.logicData.moves + " ruchów w tej turze.")
        }
        $(".unit-name").html(data.logicData.type)
        $(".commands").empty();
        data.logicData.orders.forEach(order => {
            $(".commands").append($("<button>").html(order).addClass(".singleCommand").on("click", (event) => {
                if (data.logicData.moves == 0) return;
                if (order == "move")
                    $(event.currentTarget).attr("disabled", "disabled")
                if (order != "move")
                    this.hide();
                this.executeCommand(data, order);
            }))
        });
    }

    executeCommand(unit, order) {
        Map.executeCommand(unit, order)
    }
}
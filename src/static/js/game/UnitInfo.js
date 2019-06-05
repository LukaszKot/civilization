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
        $(".unit-name").html(data.logicData.type)
        $(".commands").empty();
        data.logicData.orders.forEach(order => {
            $(".commands").append($("<button>").html(order).addClass(".singleCommand").on("click", (event) => {
                if (data.logicData.moves == 0) return;
                if (order == "move")
                    $(event.currentTarget).attr("disabled", "disabled")
                if (order == "build")
                    this.hide();
                this.executeCommand(data, order);
            }))
        });
    }

    executeCommand(unit, order) {
        Map.executeCommand(unit, order)
    }
}
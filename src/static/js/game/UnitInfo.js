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
        $(".unit-name").html(data.type)
        $(".commands").empty();
        data.orders.forEach(order => {
            $(".commands").append($("<div>").html(order).addClass(".singleCommand").on("click", () => {
                this.executeCommand(data, order);
            }))
        });
    }

    executeCommand(unit, order) {
        Map.executeCommand(unit, order)
    }
}
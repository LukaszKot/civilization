class Map {
    constructor(game) {
        if (game == null) throw new Error('Cannot be called directly');
        this.game = game;
        console.log(this.game)
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();
        for (var i = 0; i < this.game.map.size.width; i++) {
            for (var j = 0; j < this.game.map.size.height; j++) {
                var tile = new Tile();
                if (j % 2 == 1) {
                    tile.position.set(tileRadius * Math.sqrt(3) * i + tileRadius * Math.sqrt(3) / 2, 0, 2 * j * tileRadius - tileRadius / 2 * j);
                }
                else {
                    tile.position.set(tileRadius * Math.sqrt(3) * i, 0, 2 * j * tileRadius - tileRadius / 2 * j);
                }

                this.container.add(tile)
            }
        }
        cameraController.setEndsOfMap(tileRadius * Math.sqrt(3) * (this.game.map.size.width - 1), 2 * (this.game.map.size.height - 1) * tileRadius - tileRadius / 2 * (this.game.map.size.height - 1))
    }

    static async create() {
        var map = await net.getSave("a8Pv249UK0XA52Bp");
        return new Map(map);
    }
}
class Map {
    constructor(game) {
        if (game == null) throw new Error('Cannot be called directly');
        this.game = game;
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();

        for (var i = 0; i < this.game.map.tiles.length; i++) {
            var tileData = this.game.map.tiles[i];
            console.log(tileData)
            var tile = new Tile();
            if (tileData.position.z % 2 == 1) {
                tile.position.set(tileRadius * Math.sqrt(3) * tileData.position.x + tileRadius * Math.sqrt(3) / 2, 0, 2 * tileData.position.z * tileRadius - tileRadius / 2 * tileData.position.z);
            }
            else {
                tile.position.set(tileRadius * Math.sqrt(3) * tileData.position.x, 0, 2 * tileData.position.z * tileRadius - tileRadius / 2 * tileData.position.z);
            }
            this.container.add(tile)
        }
        cameraController.setEndsOfMap(tileRadius * Math.sqrt(3) * (this.game.map.size.width - 1), 2 * (this.game.map.size.height - 1) * tileRadius - tileRadius / 2 * (this.game.map.size.height - 1))
    }

    static async create() {

        var cookies = document.cookie.split("; ");
        cookies.forEach(element => {
            var cookie = element.split("=")
            if (cookie[0] == "game") {
                this.saveId = cookie[1];
            }
            if (cookie[0] == "username") {
                this.username = cookie[1];
            }
        });
        var map = await net.getSave(this.saveId);
        return new Map(map);
    }
}
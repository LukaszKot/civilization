class Map {
    constructor(game, settlerMesh) {
        if (game == null) throw new Error('Cannot be called directly');
        this.game = game;
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();
        this.settlerMesh = settlerMesh;

        for (var i = 0; i < this.game.map.tiles.length; i++) {
            var tileData = this.game.map.tiles[i];
            var tile = new Tile();
            if (tileData.position.z % 2 == 1) {
                tile.position.set(tileRadius * Math.sqrt(3) * tileData.position.x + tileRadius * Math.sqrt(3) / 2, 0, 2
                    * tileData.position.z * tileRadius - tileRadius / 2 * tileData.position.z);
            }
            else {
                tile.position.set(tileRadius * Math.sqrt(3) * tileData.position.x, 0, 2 * tileData.position.z * tileRadius - tileRadius / 2 * tileData.position.z);
            }
            tile.setLogicPosition(tileData.position.x, tileData.position.z)
            if (tileData.unit != null && tileData.unit.type == "Settler") {
                var theSettler = settlerMesh.clone();
                theSettler.position.set(tile.position.x, tile.position.y + 2.5, tile.position.z)
                theSettler.setOwner(tileData.unit.owner)
                theSettler.setLogicPosition(tileData.position.x, tileData.position.z)
                if (theSettler.logicData.owner.name != Map.username) {
                    theSettler.material.color.setHex(0xff0000);
                }
                else {
                    theSettler.material.color.setHex(0x0000ff);
                    camera.position.set(theSettler.position.x, theSettler.position.y + 50, theSettler.position.z + 30)
                    camera.lookAt(theSettler.position)
                }
                this.container.add(theSettler)
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
        var settler = await Settler.load();
        return new Map(map, settler);
    }
}
class Map {
    constructor() {
        this.width = 100;
        this.height = 50;
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
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
    }
}
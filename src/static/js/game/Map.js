class Map {
    constructor(game, settlerMesh, cityMesh) {
        if (game == null) throw new Error('Cannot be called directly');
        this.game = game;
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();
        this.settlerMesh = settlerMesh;
        this.cityMesh = cityMesh

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
            tile.setLogicPosession(tileData.unit)
            if (tileData.unit != null && tileData.unit.type == "Settler") {
                var theSettler = settlerMesh.clone();
                theSettler.position.set(tile.position.x, tile.position.y + 2.5, tile.position.z)
                theSettler.setOwner(tileData.unit.owner)
                theSettler.setLogicPosition(tileData.position.x, tileData.position.z)
                theSettler.setMoves(tileData.unit.moves)
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
            else if (tileData.city != null) {
                var city = cityMesh.clone();
                city.position.set(tile.position.x, tile.position.y + 5, tile.position.z)
                city.logicData = tileData.city
                city.logicData.position = tileData.position;
                city.logicData.type = "City"
                city.logicData.orders = ["settler", "warrior"]
                this.container.add(city)
                if (city.logicData.owner.name != Map.username) {
                    city.material.color.setHex(0xff0000);
                }
                else {
                    city.material.color.setHex(0x0000ff);
                }
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
        var city = await City.load();
        net.joinTheGame(this.saveId, this.username);
        if (map.players[map.nowPlaying].name != this.username) {
            $("#lock").css("display", "block")
        }
        this.map = new Map(map, settler, city);
        return this.map;
    }

    static executeCommand(unit, command) {
        this.map.execCommand(unit, command)
    }

    execCommand(unit, com) {
        if (command.name != "build")
            command.name = com;
        if (com == "move") {
            command.data = {
                rings: [],
                tiles: [],
                unit: unit
            }
            this.container.children.forEach(object => {
                if (object.logicData != null && object.logicData.type == "Tile" &&
                    object.position.distanceTo(unit.position) < 2 * command.data.unit.logicData.moves * Settings.tileRadius &&
                    object.logicData.unit == null) {
                    var ring = new Ring(new THREE.Vector3(object.position.x, object.position.y + 2.5, object.position.z))
                    ring.material.color.setHex(0xff69b4)
                    this.container.add(ring)
                    command.data.rings.push(ring)
                    command.data.tiles.push(object)
                }
            });
        }
        else if (com == "build" && unit.logicData.moves > 0) {
            net.buildCity(unit.logicData.position)
            command.name == null
        }
    }
}
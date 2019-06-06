class Map {
    constructor(game, settlerMesh, cityMesh, warriorMesh) {
        if (game == null) throw new Error('Cannot be called directly');
        this.game = game;
        var tileRadius = Settings.tileRadius;
        this.container = new THREE.Object3D();
        this.settlerMesh = settlerMesh;
        this.cityMesh = cityMesh
        this.warriorMesh = warriorMesh;

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
            if (tileData.unit != null && tileData.unit.type == "Warrior") {
                var theWarrior = warriorMesh.clone();
                theWarrior.position.set(tile.position.x, tile.position.y + 3, tile.position.z)
                theWarrior.setOwner(tileData.unit.owner)
                theWarrior.setLogicPosition(tileData.position.x, tileData.position.z)
                theWarrior.setMoves(tileData.unit.moves)
                if (theWarrior.logicData.owner.name != Map.username) {
                    theWarrior.material.color.setHex(0xff0000);
                }
                else {
                    theWarrior.material.color.setHex(0x0000ff);
                }
                theWarrior.logicData.type = "Warrior"
                this.container.add(theWarrior)
            }
            if (tileData.city != null) {
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
        var warrior = await Warrior.load();
        net.joinTheGame(this.saveId, this.username);
        if (map.players[map.nowPlaying].name != this.username) {
            $("#lock").css("display", "block")
        }
        this.map = new Map(map, settler, city, warrior);
        return this.map;
    }

    static executeCommand(unit, command) {
        this.map.execCommand(unit, command)
    }

    execCommand(unit, com) {
        if (com != "move")
            command.name = null;
        else command.name = com
        if (com == "move") {
            command.data = {
                rings: [],
                tiles: [],
                unit: unit
            }
            if (unit.logicData.type == "Settler") {
                this.container.children.forEach(object => {
                    if (object.logicData != null && object.logicData.type == "Tile" &&
                        object.position.distanceTo(unit.position) < 2 * command.data.unit.logicData.moves * Settings.tileRadius &&
                        this.hasUnitAndNotHaveEnemyCity(object.logicData.position) == false) {
                        var ring = new Ring(new THREE.Vector3(object.position.x, object.position.y + 2.5, object.position.z))
                        ring.material.color.setHex(0xff69b4)
                        this.container.add(ring)
                        command.data.rings.push(ring)
                        command.data.tiles.push(object)
                    }
                });
            }
            else if (unit.logicData.type == "Warrior") {
                this.container.children.forEach(object => {
                    if (object.logicData != null && object.logicData.type == "Tile" &&
                        object.position.distanceTo(unit.position) < 2 * command.data.unit.logicData.moves * Settings.tileRadius &&
                        this.hasAlly(object.logicData.position) == false) {
                        var ring = new Ring(new THREE.Vector3(object.position.x, object.position.y + 2.5, object.position.z))
                        ring.material.color.setHex(0xff69b4)
                        this.container.add(ring)
                        command.data.rings.push(ring)
                        command.data.tiles.push(object)
                    }
                });
            }

        }
        else if (com == "build" && unit.logicData.moves > 0) {
            net.buildCity(unit.logicData.position)
        }
        else if (com == "settler" || com == "warrior") {
            net.setProduction(unit.logicData.position, com)
        }
    }

    hasUnitAndNotHaveEnemyCity(logicPosition) {
        for (var i = 0; i < this.container.children.length; i++) {
            var object = this.container.children[i]
            if (object.logicData && object.logicData.position.x == logicPosition.x && object.logicData.position.z == logicPosition.z && object.logicData.type != "Tile") {
                if (object.logicData.type != "City") {
                    return true;
                }
                if (object.logicData.type == "City" && object.logicData.owner.name != Map.username) {
                    return true;
                }
            }
        }
        return false;
    }

    hasAlly(logicPosition) {
        for (var i = 0; i < this.container.children.length; i++) {
            var object = this.container.children[i]
            if (object.logicData && object.logicData.position.x == logicPosition.x && object.logicData.position.z == logicPosition.z && object.logicData.type != "Tile") {
                if (object.logicData.owner.name == Map.username) {
                    return true;
                }
            }
        }
        return false;
    }
}
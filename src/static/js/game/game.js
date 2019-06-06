var net;
var scene;
var camera;
var renderer;
var windowObject = $(window);
var updateSubscriber = []
var cameraController;
var ring;
var unitInfo;
var command = {
    name: null,
    data: null
}
$(document).ready(async function () {
    net = new Net();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        windowObject.width() / windowObject.height(),
        0.1,
        10000
    );
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);

    camera.position.set(200, 50, 100);
    camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y - 50, camera.position.z - 30));
    cameraController = new CameraController(camera);
    updateSubscriber.push(cameraController);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setSize(windowObject.width(), windowObject.height())
    $("#root").append(renderer.domElement);

    var map = await Map.create();
    scene.add(map.container)
    unitInfo = new UnitInfo();

    $("#root").on("mousemove", (event) => {
        var xaxis = event.clientX / windowObject.width()
        var zaxis = event.clientY / windowObject.height()
        cameraController.moveRight = xaxis > 0.9
        cameraController.moveLeft = xaxis < 0.1
        cameraController.moveTop = zaxis < 0.1
        cameraController.moveBottom = zaxis > 0.9
    })

    $("#root").on("mouseout", event => {
        cameraController.moveRight = false
        cameraController.moveLeft = false
        cameraController.moveTop = false
        cameraController.moveBottom = false
    })

    $("#root").on("wheel", (event) => {
        if (event.originalEvent.deltaY < 0) {
            cameraController.zooming = true;
            setTimeout(() => cameraController.zooming = false, 300);
        }
        if (event.originalEvent.deltaY > 0) {
            cameraController.unzooming = true;
            setTimeout(() => cameraController.unzooming = false, 300);
        }

    })

    $("#next-turn").on("click", (event) => {
        if (command.name == "move") return;
        $("#lock").css("display", "block")
        net.nextTurn();
    })

    $(window).on("keyup", (event) => {
        if (event.keyCode == 13 && $("#lock").css("display") == "none") {
            if (command.name == "move") return;
            $("#lock").css("display", "block")
            net.nextTurn();
        }
    })


    net.onPlayerJoinedTheGame(() => {
        console.log("player joined the game")
    })

    net.onUnitMoved((event) => {
        var to;
        var from;
        var notTile;
        map.container.children.forEach(tile => {
            if (tile.logicData != null && tile.logicData.position.x == event.to.position.x && tile.logicData.position.z == event.to.position.z && tile.logicData.type == "Tile") {
                to = tile;
            }
            if (tile.logicData != null && tile.logicData.position.x == event.from.position.x && tile.logicData.position.z == event.from.position.z && tile.logicData.type != "Tile" && tile.logicData.type != "City") {
                from = tile;
            }
        });
        map.container.children.forEach(tile => {
            if (tile.logicData != null && tile.logicData.position.x == event.to.position.x && tile.logicData.position.z == event.to.position.z && tile.logicData.type != "Tile") {
                notTile = tile;
                if (from.logicData.type == "Warrior") {
                    map.container.remove(notTile)
                }
            }
        });
        from.position.set(to.position.x, from.position.y, to.position.z)
        from.logicData.position = event.to.position
        from.logicData.moves -= event.usedMoves
        if (command.data != null) {
            command.data.rings.forEach(ring => {
                map.container.remove(ring)
            });
        }
        command.name = null
        command.data = null
    })

    net.onNextTurnBegin((event) => {
        unitInfo.hide();
        map.game.turn = event.turn
        map.game.nowPlaying = event.nowPlaying;
        if (map.game.nowPlaying == 0) {
            map.container.children.forEach(object => {
                if (object.logicData && object.logicData.unit) {
                    object.logicData.unit.moves = 2;
                }
                if (object.logicData && object.logicData.type == "Settler") {
                    object.logicData.moves = 2;
                }
                if (object.logicData && object.logicData.type == "Warrior") {
                    object.logicData.moves = 2;
                }

                if (object.logicData && object.logicData.type == "City") {
                    if (object.logicData.production) {
                        object.logicData.turnToTheEnd--;
                    }
                    if (object.logicData.turnToTheEnd == 0) {
                        if (object.logicData.production == "settler") {
                            var theSettler = map.settlerMesh.clone();
                            theSettler.position.set(object.position.x, 2.5, object.position.z)
                            theSettler.setOwner(object.logicData.owner)
                            theSettler.setLogicPosition(object.logicData.position.x, object.logicData.position.z)
                            theSettler.setMoves(2)
                            if (theSettler.logicData.owner.name != Map.username) {
                                theSettler.material.color.setHex(0xff0000);
                            }
                            else {
                                theSettler.material.color.setHex(0x0000ff);
                            }
                            map.container.add(theSettler)
                        }
                        else if (object.logicData.production == "warrior") {
                            var theWarrior = map.warriorMesh.clone();
                            theWarrior.position.set(object.position.x, 2.5, object.position.z)
                            theWarrior.setOwner(object.logicData.owner)
                            theWarrior.setLogicPosition(object.logicData.position.x, object.logicData.position.z)
                            theWarrior.setMoves(2)
                            if (theWarrior.logicData.owner.name != Map.username) {
                                theWarrior.material.color.setHex(0xff0000);
                            }
                            else {
                                theWarrior.material.color.setHex(0x0000ff);
                            }
                            map.container.add(theWarrior)
                        }
                        object.logicData.turnToTheEnd = null;
                        object.logicData.production = null;
                    }

                }
            });
        }
        if (map.game.players[map.game.nowPlaying].name != Map.username) {
            $("#lock").css("display", "block")
        }
        else {
            $("#lock").css("display", "none")
        }
    })

    net.onCityBuilded((event) => {
        map.container.children.forEach(object => {
            if (object.logicData && object.logicData.position.x == event.tile.position.x && object.logicData.position.z == event.tile.position.z && object.logicData.type == "Settler") {
                map.container.remove(object);
                scene.remove(ring);
                var city = map.cityMesh.clone();
                city.position.set(object.position.x, object.position.y, object.position.z);
                city.logicData = event.tile.city
                city.logicData.type = "City"
                city.logicData.orders = ["settler", "warrior"]
                city.logicData.position = event.tile.position
                city.logicData.owner = event.tile.city.owner
                if (city.logicData.owner.name == Map.username) {
                    city.material.color.setHex(0x0000ff)
                }
                else {
                    city.material.color.setHex(0xff0000)
                }
                map.container.add(city)
            }
        });

        map.container.children.forEach(object => {
            if (object.logicData && object.logicData.position.x == event.tile.position.x && object.logicData.position.z == event.tile.position.z && object.logicData.type == "Tile") {
                object.logicData = event.tile;
            }
        })

    })

    net.onStartedUnitProduction(event => {
        var city;
        map.container.children.forEach(object => {
            if (object.logicData && object.logicData.position.x == event.tile.position.x && object.logicData.position.z == event.tile.position.z && object.logicData.type == "City") {
                city = object;
            }
        })
        city.logicData.production = event.tile.city.production;
        city.logicData.turnToTheEnd = event.tile.city.turnToTheEnd;

    })

    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2()
    $("#root").on("mousedown", (event) => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        if (command.name == null) {
            var intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                var intersected = intersects[0].object
                if (intersected.logicData && intersected.logicData.owner) {
                }

                if (intersected.logicData != null && intersected.logicData.type == "Settler" && intersected.logicData.owner.name == Map.username) {
                    if (ring) scene.remove(ring)
                    ring = new Ring(intersected.position);
                    scene.add(ring)
                    unitInfo.display();
                    unitInfo.setData(intersected)

                } else if (intersected.logicData != null && intersected.logicData.type == "City" && intersected.logicData.owner.name == Map.username) {
                    if (ring) scene.remove(ring)
                    ring = new Ring(intersected.position);
                    ring.position.y -= 2.5
                    scene.add(ring)
                    unitInfo.display();
                    unitInfo.setData(intersected)
                }
                else if (intersected.logicData != null && intersected.logicData.type == "Warrior" && intersected.logicData.owner.name == Map.username) {
                    if (ring) scene.remove(ring)
                    ring = new Ring(intersected.position);
                    ring.position.y -= 0.5
                    scene.add(ring)
                    unitInfo.display();
                    unitInfo.setData(intersected)
                }
            }
        }
        else if (command.name == "move") {
            var intersects = raycaster.intersectObjects(command.data.tiles);
            if (intersects.length > 0) {

                var intersected = intersects[0].object
                var usedMoves = intersected.position.distanceTo(command.data.unit.position) > 2 * Settings.tileRadius ? 2 : 1
                var to = intersected.logicData.position;
                var from = command.data.unit.logicData.position
                net.moveUnit(from, to, usedMoves);
                unitInfo.hide();
                scene.remove(ring)
            }
        }
    })
    function render() {
        for (var i = 0; i < updateSubscriber.length; i++) {
            updateSubscriber[i].update();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
})
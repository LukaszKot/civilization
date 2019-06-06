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
        $("#lock").css("display", "block")
        net.nextTurn();
    })


    net.onPlayerJoinedTheGame(() => {
        console.log("player joined the game")
    })

    net.onUnitMoved((event) => {
        var to;
        var from;
        var fromTile
        map.container.children.forEach(tile => {
            if (tile.logicData != null && tile.logicData.position.x == event.to.position.x && tile.logicData.position.z == event.to.position.z) {
                to = tile;
            }
            if (tile.logicData != null && tile.logicData.position.x == event.from.position.x && tile.logicData.position.z == event.from.position.z && tile.logicData.type != "Tile") {
                from = tile;
            }
            if (tile.logicData != null && tile.logicData.position.x == event.from.position.x && tile.logicData.position.z == event.from.position.z && tile.logicData.type == "Tile") {
                fromTile = tile;
            }
        });
        from.position.set(to.position.x, from.position.y, to.position.z)
        from.logicData.position = event.to.position
        from.logicData.moves -= event.usedMoves
        to.logicData.unit = fromTile.logicData.unit;
        to.logicData.unit.moves -= event.usedMoves
        fromTile.logicData.unit = null;
        if (command.data != null) {
            command.data.rings.forEach(ring => {
                map.container.remove(ring)
            });
        }
        command.name = null
        command.data = null
    })

    net.onNextTurnBegin((event) => {
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
                city.logicData.city = event.tile.city
                city.logicData.position = event.tile.position
                map.container.add(city)
            }
        });

        map.container.children.forEach(object => {
            if (object.logicData && object.logicData.position.x == event.tile.position.x && object.logicData.position.z == event.tile.position.z && object.logicData.type == "Tile") {
                object.logicData = event.tile;
            }
        })

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
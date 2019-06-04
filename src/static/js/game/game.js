var net;
var scene;
var camera;
var renderer;
var windowObject = $(window);
var updateSubscriber = []
var cameraController;
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

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    var map = await Map.create();
    scene.add(map.container)

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

    function render() {
        for (var i = 0; i < updateSubscriber.length; i++) {
            updateSubscriber[i].update();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
})
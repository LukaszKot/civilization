var net;
var scene;
var camera;
var renderer;
var windowObject = $(window);
$(document).ready(async function () {
    net = new Net();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        45,
        windowObject.width() / windowObject.height(),
        0.1,
        10000
    );
    camera.position.set(0, 300, 200);
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff);
    renderer.setSize(windowObject.width(), windowObject.height())
    $("#root").append(renderer.domElement);

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    var map = await Map.create();
    scene.add(map.container)

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
})
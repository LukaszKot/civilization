class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.cameraSpeed = Settings.cameraSpeed
        this.moveRight = false;
        this.moveLeft = false;
        this.moveTop = false;
        this.moveBottom = false;
        this.zooming = false;
        this.unzooming = false;
    }

    update() {
        if (this.moveRight) {
            this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), this.cameraSpeed);
        }
        if (this.moveLeft) {
            this.camera.translateOnAxis(new THREE.Vector3(-1, 0, 0), this.cameraSpeed);
        }
        if (this.moveTop) {
            this.camera.position.z -= this.cameraSpeed;
        }
        if (this.moveBottom) {
            this.camera.position.z += this.cameraSpeed;
        }
        if (this.zooming) {
            this.camera.translateOnAxis(new THREE.Vector3(0, 0, -1), this.cameraSpeed * 2);
        }
        if (this.unzooming) {
            this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), this.cameraSpeed * 2);
        }
    }
}
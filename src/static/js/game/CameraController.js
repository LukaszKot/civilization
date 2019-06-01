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

    setEndsOfMap(rightX, bottomY) {
        this.endsOfMap = {
            right: rightX,
            bottom: bottomY
        }
    }

    update() {
        if (this.moveRight) {
            if (this.endsOfMap == null || this.camera.position.x < this.endsOfMap.right - 20)
                this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), this.cameraSpeed);
        }
        if (this.moveLeft) {
            if (this.camera.position.x > 20)
                this.camera.translateOnAxis(new THREE.Vector3(-1, 0, 0), this.cameraSpeed);
        }
        if (this.moveTop) {
            if (this.camera.position.z > 35)
                this.camera.position.z -= this.cameraSpeed;
        }
        if (this.moveBottom) {
            if (this.endsOfMap == null || this.camera.position.z < this.endsOfMap.bottom + 20)
                this.camera.position.z += this.cameraSpeed;
        }
        if (this.zooming) {
            if (this.camera.position.y > 30)
                this.camera.translateOnAxis(new THREE.Vector3(0, 0, -1), this.cameraSpeed * 2);
        }
        if (this.unzooming) {
            if (this.camera.position.y < 100)
                this.camera.translateOnAxis(new THREE.Vector3(0, 0, 1), this.cameraSpeed * 2);
        }
    }
}
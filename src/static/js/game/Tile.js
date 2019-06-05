class Tile extends THREE.Mesh {
    constructor() {
        var tileRadius = Settings.tileRadius
        var geometry = new THREE.CylinderGeometry(tileRadius, tileRadius, 1, 6);
        var material = new THREE.MeshPhongMaterial({
            color: 0x00aa00
        })
        super(geometry, material)
        var edgesGeometry = new THREE.EdgesGeometry(this.geometry);
        var edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 100 });
        var edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.add(edges);
        this.logicData = {
            position: null,
            type: "Tile",
            unit: null
        }
    }

    setLogicPosition(x, z) {
        this.logicData.position = {
            x: x,
            z: z
        }
    }

    setLogicPosession(unit) {
        this.logicData.unit = unit;
    }
}
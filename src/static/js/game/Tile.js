class Tile extends THREE.Mesh {
    constructor() {
        var tileRadius = Settings.tileRadius
        var geometry = new THREE.CylinderGeometry(tileRadius, tileRadius, 1, 6);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        })
        super(geometry, material)
        var edgesGeometry = new THREE.EdgesGeometry(this.geometry);
        var edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 100 });
        var edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.add(edges);
    }
}
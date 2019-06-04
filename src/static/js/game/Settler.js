class Settler extends THREE.Mesh {
    constructor(geometry) {
        var modelMaterial = new THREE.MeshBasicMaterial(
            {
                map: new THREE.TextureLoader().load("/gfx/Settler.jpg"),
                morphTargets: true
            });
        if (geometry == null) throw "Never use constructor."

        super(geometry, modelMaterial)
        this.scale.set(0.1, 0.1, 0.1)
        this.rotation.y = Math.PI / 2 * 3 / 2
        this.name = "Settler"
        this.logicData = {
            owner: null
        }
    }

    static async load() {

        return new Promise((resolve) => {
            var loader = new THREE.JSONLoader();
            loader.load('/models/settler.json', (geometry) => {
                resolve(new Settler(geometry));
            });
        })
    }

    setOwner(owner) {
        this.logicData.owner = owner;
    }
}
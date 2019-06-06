class City extends THREE.Mesh {
    constructor(geometry) {
        var modelMaterial = new THREE.MeshPhongMaterial(
            {
                map: new THREE.TextureLoader().load("/gfx/City.jpg"),
                morphTargets: true
            });
        if (geometry == null) throw "Never use constructor."

        super(geometry, modelMaterial)
        this.scale.set(0.1, 0.1, 0.1)
        this.rotation.y = Math.PI / 2 * 3 / 2
        this.name = "City"
        this.logicData = {
            owner: null,
            position: null,
            type: "City",
            orders: ["settler", "warrior"]
        }
    }

    static async load() {
        return new Promise((resolve) => {
            var loader = new THREE.JSONLoader();
            loader.load('/models/city.json', (geometry) => {
                resolve(new City(geometry));
            });
        })
    }
}
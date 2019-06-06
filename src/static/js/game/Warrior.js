class Warrior extends THREE.Mesh {
    constructor(geometry) {
        var modelMaterial = new THREE.MeshPhongMaterial(
            {
                map: new THREE.TextureLoader().load("/gfx/Warrior.jpg"),
                morphTargets: true
            });
        if (geometry == null) throw "Never use constructor.";

        super(geometry, modelMaterial);
        this.scale.set(0.1, 0.1, 0.1)
        this.rotation.y = Math.PI / 2 * 3 / 2
        this.name = "Warrior"
        this.logicData = {
            owner: null,
            position: null,
            type: "Warrior",
            orders: ["move"],
            moves: 2
        }
    }

    static async load() {
        return new Promise((resolve) => {
            var loader = new THREE.JSONLoader();
            loader.load('/models/warrior.json', (geometry) => {
                resolve(new Warrior(geometry));
            });
        })
    }

    setOwner(owner) {
        this.logicData.owner = owner;
    }

    setLogicPosition(x, z) {
        this.logicData.position = {
            x: x,
            z: z
        }
    }

    setMoves(moves) {
        this.logicData.moves = moves;
    }
}
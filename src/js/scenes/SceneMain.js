import Phaser from "phaser";
import Raptor from "../entities/Raptor";
import * as EntityManager from "../entities/EntityManager";
import Counter from "../entities/Counter";


export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({key: "SceneMain"});
    }

    preload() {
        this.load.setPath("./src/assets");

        // World
        this.load.image("grass", "world/grass.png");
        this.load.image("dirt", "world/dirt.png");
        this.load.image("plants", "world/plants.png");
        this.load.image("trees", "world/trees.png");

        this.load.tilemapTiledJSON('map', "world/map.json");


        // Entities
        this.load.spritesheet("raptor", "sprites/entities/raptor.png", {
            frameWidth: 19,
            frameHeight: 17
        });
        this.load.spritesheet("sheep", "sprites/entities/sheep.png", {
            frameWidth: 21,
            frameHeight: 16
        });
        this.load.spritesheet("chicken", "sprites/entities/chicken.png", {
            frameWidth: 17,
            frameHeight: 19
        });
        this.load.spritesheet("pig", "sprites/entities/pig.png", {
            frameWidth: 31,
            frameHeight: 17
        });
        this.load.spritesheet("dummy", "sprites/entities/dummy.png", {
            frameWidth: 20,
            frameHeight: 18
        });
        this.load.image("counter", "sprites/entities/counter.png");

        // Items
        this.load.spritesheet("porkchop", "sprites/items/porkchop.png", {
            frameWidth: 10,
            frameHeight: 10
        });

        // HUD
        this.load.image("invSlot", "sprites/hud/invSlot.png");

        // Particles
        this.load.spritesheet("slash", "sprites/particles/slash.png", {
            frameWidth: 19,
            frameHeight: 16
        });
        this.load.spritesheet("bits", "sprites/particles/bits.png", {
            frameWidth: 16,
            frameHeight: 16
        });

    }

    create() {
        const {width, height} = this.sys.game.config;

        this.width = width;
        this.height = height;

        // Map creation
        this.map = this.make.tilemap({key: "map", tileWidth: 16, tileHeight: 16});
        const grassTileset = this.map.addTilesetImage("grass", "grass");
        this.grassLayer = this.map.createLayer("grass", grassTileset);
        const dirtTileset = this.map.addTilesetImage("dirt", "dirt");
        this.dirtLayer = this.map.createLayer("dirt", dirtTileset);
        const topTileset = this.map.addTilesetImage("trees", "trees");
        this.topLayer = this.map.createLayer("top", topTileset).setDepth(10);
        this.topLayer.setCollisionByProperty({collide: true});

        // Counters
        this.counter = new Counter(this, 300, 48);

        // Keyboard key binding
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyboardBind = this.input.keyboard.addKeys({
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            use: Phaser.Input.Keyboard.KeyCodes.E,
            action: Phaser.Input.Keyboard.KeyCodes.F,
            drop: Phaser.Input.Keyboard.KeyCodes.G
        });

        this.raptor = new Raptor(this, this.width / 2, this.height / 2);

        this.entities = [];
        EntityManager.spawnGroup(this, "chicken", 10, 64, 64, 256, 256);
        EntityManager.spawnGroup(this, "sheep", 4, 256, 256, 512, 512);
        EntityManager.spawnGroup(this, "pig", 6, 64, 256, 512, 512);

        this.cameras.main.setBounds(0, 0, 16 * 64, 16 * 64, true, true, true, false);
        this.physics.world.setBounds(0, 0, 16 * 64, 16 * 64, true, true, true, false);
        this.cameras.main.startFollow(this.raptor.sprite);

        // Initialize HUD scene
        // Re-run it if already loaded in a previous run
        this.hud = this.scene.get("Hud");
        if (!this.hud.scene.isActive()) 
            this.scene.run("Hud");
        


    }

    update(time, delta) {
        this.raptor.handlePlayerMovements();
        this.raptor.handlePlayerControls();
        this.entities.forEach(e => e.update());
    }
}

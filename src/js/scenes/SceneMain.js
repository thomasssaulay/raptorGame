import Phaser from "phaser";
import Raptor from "../entities/Raptor";
import Truck from "../entities/Truck";
import * as EntityManager from "../entities/EntityManager";
import * as Globals from "../Globals";
import Counter from "../entities/Counter";


export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
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
            frameWidth: 38, //19,
            frameHeight: 50 //17
        });
        this.load.spritesheet("sheep", "sprites/entities/sheep.png", {
            frameWidth: 22,
            frameHeight: 17
        });
        this.load.spritesheet("chicken", "sprites/entities/chicken.png", {
            frameWidth: 18,
            frameHeight: 20
        });
        this.load.spritesheet("pig", "sprites/entities/pig.png", {
            frameWidth: 32,
            frameHeight: 18
        });
        this.load.spritesheet("dummy", "sprites/entities/dummy.png", {
            frameWidth: 20,
            frameHeight: 18
        });
        this.load.image("counter", "sprites/entities/counter.png");
        this.load.image("truck", "sprites/entities/truck.png");

        // Items
        this.load.spritesheet("items", "sprites/items/items.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        // HUD
        this.load.image("invSlot", "sprites/hud/invSlot.png");
        this.load.spritesheet("keys", "sprites/hud/keys.png", {
            frameWidth: 59,
            frameHeight: 12
        });
        this.load.spritesheet("numbers", "sprites/hud/numbers.png", {
            frameWidth: 8,
            frameHeight: 16
        });
        this.load.image("orderCard", "sprites/hud/orderCard.png");

        // Particles
        this.load.spritesheet("slash", "sprites/particles/slash.png", {
            frameWidth: 38,
            frameHeight: 32
        });
        this.load.spritesheet("bits", "sprites/particles/bits.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        // Shaders
        // this.load.glsl('bundle', 'shaders/bundle2.glsl.js');
        // this.load.glsl('grain', 'shaders/grain.glsl');
    }


    create() {
        const { width, height, zoom } = this.sys.game.config;

        this.width = width * zoom;
        this.height = height * zoom;

        // Map creation
        this.map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
        const grassTileset = this.map.addTilesetImage("grass", "grass");
        this.grassLayer = this.map.createLayer("grass", grassTileset);
        const dirtTileset = this.map.addTilesetImage("dirt", "dirt");
        this.dirtLayer = this.map.createLayer("dirt", dirtTileset);
        const topTileset = this.map.addTilesetImage("trees", "trees");
        this.topLayer = this.map.createLayer("top", topTileset).setDepth(10);
        this.topLayer.setCollisionByProperty({ collide: true });

        // Counters
        this.counters = [];
        for (let i = 0; i < 4; i++) {
            this.counters.push(new Counter(this, 300 + i * 32, 48));
        }

        this.truck = new Truck(this, 480, 64);

        // Keyboard key binding
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyboardBind = this.input.keyboard.addKeys({
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            use: Phaser.Input.Keyboard.KeyCodes.E,
            action: Phaser.Input.Keyboard.KeyCodes.F,
            drop: Phaser.Input.Keyboard.KeyCodes.G,
            debug: Phaser.Input.Keyboard.KeyCodes.R
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

        // Ligths
        if (Globals.ENABLE_LIGHTS) {
            this.lights.enable();
            this.lights.setAmbientColor(0xcccccc);
            this.ligth = this.lights.addLight(this.raptor.x, this.raptor.y, this.width * 2).setIntensity(0.25);
            this.raptor.sprite.setPipeline('Light2D');
            // this.entities.forEach(ent => ent.sprite.setPipeline('Light2D'));
            this.grassLayer.setPipeline('Light2D');
            this.dirtLayer.setPipeline('Light2D');
            this.topLayer.setPipeline('Light2D');
        }
    }

    update(time, delta) {
        this.raptor.handlePlayerMovements();
        this.raptor.handlePlayerControls();
        this.entities.forEach(e => e.update());
        if (Globals.ENABLE_LIGHTS) this.ligth.setPosition(this.raptor.x, this.raptor.y);
    }
}
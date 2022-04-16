import Phaser from "phaser";
import Raptor from "../entities/Raptor";
import Entity from "../entities/Entity";


export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    preload() {
        this.load.setPath("./src/assets");

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

        // Particles
        this.load.spritesheet("slash", "sprites/particles/slash.png", {
            frameWidth: 19,
            frameHeight: 16
        });

    }

    create() {
        const { width, height } = this.sys.game.config;
        this.width = width;
        this.height = height;

        // Keyboard key binding
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorsAttack = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.Z,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.Q,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.add
            .text(width / 2, 64, "main scene", {
                font: "25pt PearSoda",
                color: "white"
            })
            .setOrigin(0.5, 0.5);

        this.raptor = new Raptor(this, this.width / 2, this.height / 2);

        this.entities = [];

        for (let i = 0; i < 5; i++) {
            this.entities.push(new Entity(this, Phaser.Math.Between(-64, 64), Phaser.Math.Between(-64, 64), "chicken"));

            this.physics.add.overlap(
                this.raptor.slashSprite,
                this.entities[this.entities.length - 1].sprite,
                function(raptor, ent) {
                    if (!ent.parentEntity.isHit) {
                        console.log(ent.body.velocity)
                            // ent.body.setVelocity({ x: -1, y: 0 });
                        ent.parentEntity.onHit();
                    }
                });
        }

        this.cameras.main.startFollow(this.raptor.sprite);
    }

    update(time, delta) {
        this.raptor.handlePlayerControls();
        this.raptor.handlePlayerAttack();
        this.entities.forEach(e => e.update());
    }
}
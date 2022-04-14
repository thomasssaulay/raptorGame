import Phaser from "phaser";
import Raptor from "../entities/Raptor";


export default class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    preload() {
        this.load.setPath("./src/assets");

        this.load.spritesheet("raptor", "sprites/entities/raptor.png", {
            frameWidth: 19,
            frameHeight: 17
        });
    }

    create() {
        const { width, height } = this.sys.game.config;
        this.width = width;
        this.height = height;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.add
            .text(width / 2, 64, "main scene", {
                font: "25pt courier",
                color: "white"
            })
            .setOrigin(0.5, 0.5);

        this.raptor = new Raptor(this, this.width / 2, this.height / 2);
    }

    update(time, delta) {
        this.raptor.handlePlayerControls();
    }
}
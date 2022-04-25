import Phaser from "phaser";
import * as Globals from "../Globals";

export default class LoadingBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value, maxValue, width = 64, height = 8) {
        super(scene);
        this.scene = scene;

        this.width = width;
        this.height = height;

        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.value = value;
        this.maxValue = maxValue;

        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bar = new Phaser.GameObjects.Graphics(this.scene);

        this.draw();

        this.scene.add.existing(this.bg);
        this.scene.add.existing(this.bar);
    }

    set(value, maxValue = this.maxValue) {
        this.value = value;
        this.maxValue = maxValue;

        if (this.value < 0) {
            this.value = 0;
        }
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }

        this.draw();

        return this.value === 0;
    }

    setPercent(percent) {
        this.value = percent * this.maxValue;

        if (this.value < 0) {
            this.value = 0;
        }
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }

        this.draw();

        return this.value === 0;
    }


    draw() {
        this.bar.clear();
        this.bg.clear();

        //  BG
        this.bg.lineStyle(4, Globals.PALETTE[20]);
        this.bg.strokeRect(this.x, this.y, this.width, this.height);

        //  Value
        this.bar.fillStyle(Globals.PALETTE[1]);

        let d = this.value / this.maxValue;

        this.bar.fillRect(
            this.x + 2,
            this.y + 2,
            d * this.width - 4,
            this.height - 4
        );
    }
}
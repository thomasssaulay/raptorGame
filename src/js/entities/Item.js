import Phaser from "phaser";
import * as Globals from "../Globals";

export default class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene);

        this.scene = scene;
        this.name = name;

        this.x = x;
        this.y = y;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, name, 0).setOrigin(0.5, 0.5).setDepth(1);
        this.sprite.parentEntity = this;

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(this.width - 4, this.height - 4);

        this.scene.tweens.add({
            targets: this.sprite,
            y: this.y - 4,
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    update() {
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }

    onCollideWithRaptor() { // console.log("ON COLLIDE :: Collide with " + this.name);

        this.scene.hud.addItemToInventory(this.name);

        this.destroy();
    }

    destroy() {
        if (this.sprite !== null) 
            this.sprite.destroy();
        


    }
}

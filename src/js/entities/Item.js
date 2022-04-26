import Phaser from "phaser";
import * as Globals from "../Globals";

export default class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name, moving = true, chopped = false, contains = []) {
        super(scene);

        this.scene = scene;
        this.name = name;

        this.x = x;
        this.y = y;

        this.chopped = chopped;
        this.choppable = (name === "porkchop" || name === "steak" || name === "thighs") ? true : false;

        let frame = Globals.ITEMS.indexOf(name);
        if (frame < 0) frame = 1;
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "items", frame).setOrigin(0.5, 0.5).setDepth(1);
        this.sprite.parentEntity = this;

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(this.width - 4, this.height - 4);

        this.contains = contains;

        if (moving)
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

    onCollideWithRaptor() {
        if (this.scene.hud.emptyInventorySlot > 0) {
            this.scene.hud.addItemToInventory(this.name);

            this.destroy();
        }
    }

    chop() {
        this.chopped = true;
        this.name = "chopped " + this.name;
        this.sprite.setFrame(this.sprite.frame.name + 1);
    }

    setBox() {
        this.name = "Box";
        this.sprite.setFrame(0);
    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();

        if (this.name === "egg")
            this.scene.nEggs--;
    }
}
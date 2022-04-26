import Phaser from "phaser";
import * as Globals from "../Globals";

export default class Counter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "counter", 0).setOrigin(0.5, 0.5).setDepth(1);
        this.sprite.parentEntity = this;

        this.sprite.body.setSize(this.width, this.height - 2);
        this.sprite.body.setOffset(0, 0);
        this.sprite.body.setImmovable(true);

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.hold = null;

        this.detectionRadius = 48;
        this.detectionTime = 100;

        this.detectionTimer = this.scene.time.addEvent({
            delay: this.detectionTime,
            callback: () => {
                if (Globals.DEBUG_MODE)
                    this.debugDetection = this.scene.add.rectangle(this.x, this.y, this.width, this.detectionRadius).setStrokeStyle(2, 0x121212);

                let bodies = this.scene.physics.overlapRect(this.x, this.y, this.width, this.detectionRadius, true, false);
                let raptorIsNear = false;
                bodies.forEach(b => {
                    if (b.gameObject.parentEntity !== undefined) {
                        // Sets reptor's nearestCounter
                        if (b.gameObject.parentEntity.name === "Raptor")
                            raptorIsNear = true;
                    }
                });
                if (raptorIsNear) {
                    // Raptor close to counter
                    this.scene.raptor.nearestCounter = this;
                    // Shows info boxes
                    // Mix
                    if (this.hold !== null && this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null) {
                        this.scene.raptor.infoBoxPick.setVisible(true).setFrame(4).setPosition(this.x, this.y - 35);
                    }
                    // Place
                    if (this.hold === null && this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null)
                        this.scene.raptor.infoBox.setVisible(true).setFrame(1).setPosition(this.x, this.y - 24);
                    else
                        this.scene.raptor.infoBox.setVisible(false);
                    // Chop
                    if (this.hold !== null) {
                        if (!this.hold.chopped && this.hold.name !== "Box" && this.hold.name !== "Egg" && this.hold.name !== "Berry")
                            this.scene.raptor.infoBox.setVisible(true).setFrame(0).setPosition(this.x, this.y - 24);
                        else this.scene.raptor.infoBox.setVisible(false);

                        if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold === null)
                            this.scene.raptor.infoBoxPick.setVisible(true).setFrame(3).setPosition(this.x, this.y - 35);
                        // else {
                        //     this.scene.raptor.infoBoxPick.setVisible(false);
                        //     console.log("dazd");
                        // }
                    } else {
                        this.scene.raptor.infoBoxPick.setVisible(false);
                    }

                } else {
                    // Raptor leaves counter
                    if (this.scene.raptor.nearestCounter === this) {
                        this.scene.raptor.nearestCounter = null;
                        this.scene.raptor.infoBox.setVisible(false);
                        this.scene.raptor.infoBoxPick.setVisible(false);
                    }
                }
                if (Globals.DEBUG_MODE)
                    this.scene.time.delayedCall(this.detectionTime, () => {
                        this.debugDetection.destroy();
                    }, [], this);
            },
            callbackScope: this,
            loop: true
        });

    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();
    }
}
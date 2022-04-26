import Phaser from "phaser";
import * as Globals from "../Globals";

export default class Truck extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "truck", 0).setOrigin(0.5, 0.5).setDepth(1);
        this.sprite.parentEntity = this;

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(this.width - 2, this.height / 1.5);
        this.sprite.body.setImmovable(true);

        this.detectionRadius = 128;
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
                        // Sets raptor near truck 
                        if (b.gameObject.parentEntity.name === "Raptor")
                            raptorIsNear = true;
                    }
                });
                // Shows info box
                // Serve
                if (raptorIsNear) {
                    if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null) {
                        this.scene.raptor.infoBoxServe.setVisible(true).setPosition(this.x, this.y - 24);
                        this.scene.raptor.nearTruck = true;
                    } else
                        this.scene.raptor.infoBoxServe.setVisible(false);

                } else {
                    this.scene.raptor.infoBoxServe.setVisible(false);
                    this.scene.raptor.nearTruck = false;
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
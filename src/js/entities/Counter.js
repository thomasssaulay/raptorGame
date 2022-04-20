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

        this.sprite.body.setSize(this.width - 2, this.height - 2);
        this.sprite.body.setImmovable(true);

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.hold = null;

        this.detectionRadius = 40;
        this.detectionTime = 400;

        this.detectionTimer = this.scene.time.addEvent({
            delay: this.detectionTime,
            callback: () => {
                if (Globals.DEBUG_MODE) 
                    this.debugDetection = this.scene.add.circle(this.x, this.y, this.detectionRadius).setStrokeStyle(2, 0x121212);
                


                let bodies = this.scene.physics.overlapCirc(this.x, this.y, this.detectionRadius, true, false);
                let raptorIsNear = false;
                bodies.forEach(b => {
                    if (b.gameObject.parentEntity !== undefined) { // Sets reptor's nearestCounter
                        if (b.gameObject.parentEntity.name === "Raptor") 
                            raptorIsNear = true;
                        


                    }
                });
                if (raptorIsNear) 
                    this.scene.raptor.nearestCounter = this;
                 else {
                    if (this.scene.raptor.nearestCounter === this) 
                        this.scene.raptor.nearestCounter = null;
                    
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

    update() {
        this.x = this.sprite.x;
        this.y = this.sprite.y;
    }

    onCollideWithRaptor() {
        // TODO :: Show "pick up" sign and wait for input before adding

        // this.scene.hud.addItemToInventory(this.name);

        // this.destroy();
    }

    destroy() {
        if (this.sprite !== null) 
            this.sprite.destroy();
        


    }
}

import Phaser from "phaser";
import Item from "./Item";
import * as Globals from "../Globals";
import * as ParticleManager from "../ParticleManager";

export default class BerryBush extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);

        this.scene = scene;

        this.x = x;
        this.y = y;
        this.blinkTimer = null;
        this.cooldownTimer = null;
        this.hasBerry = true;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "berryBush", 0).setOrigin(0.5, 0.5).setDepth(1);
        this.sprite.parentEntity = this;

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(this.width - 2, this.height - 2);
        this.sprite.body.setImmovable(true);

        this.scene.physics.add.overlap(this.scene.raptor.slashSprite, this.sprite, (collider, ent) => ent.parentEntity.onCollideWithRaptor());

    }

    blink() {
        this.scene.time.addEvent({
            delay: Globals.BLINK_DELAY,
            callback: () => {
                if (this.sprite.tintTopLeft === 0xfafafa)
                    this.sprite.clearTint();
                else
                    this.sprite.setTintFill(0xfafafa);
            },
            callbackScope: this,
            repeat: Globals.BLINK_REPEAT
        });
    }

    resetBlinkTimer() {
        if (this.blinkTimer !== null) {
            this.blinkTimer.remove();
            this.blinkTimer = null;
        }
    }

    onCollideWithRaptor() {
        if (!this.isHit) {

            this.onHit();
        }
    }

    onHit() {
        if (this.hasBerry) {
            this.hasBerry = false;
            this.isHit = true;

            this.blink();
            this.resetBlinkTimer();
            this.blinkTimer = this.scene.time.delayedCall(Globals.BLINK_DELAY * Globals.BLINK_REPEAT, () => {
                this.isHit = false
            }, [], this);

            // Particle
            ParticleManager.emitBitsParticles(this.scene, this, 0x3ca370);

            // Drops berries
            const dropOffset = 32;
            for (let i = 0; i < 3; i++) {
                const item = new Item(this.scene, this.x + Phaser.Math.Between(-dropOffset, dropOffset), this.y + Phaser.Math.Between(-dropOffset, dropOffset), "berry");
                this.scene.physics.add.overlap(this.scene.raptor.sprite, item.sprite, (collider, it) => it.parentEntity.onCollideWithRaptor());
            }


        } else {
            //Restart cooldown
            this.cooldownTimer = this.scene.time.addEvent({
                delay: Globals.BERRYBUSH_COOLDOWN,
                callback: () => {
                    this.hasBerry = true;
                },
                callbackScope: this,
                repeat: 0
            });
        }
    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();
    }
}
import Phaser from "phaser";
import * as Globals from "../Globals";

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteName = "dummy") {
        super(scene);

        this.data = {...Globals.ENTITIES[spriteName] };

        this.scene = scene;

        this.isHit = false;
        this.blinkTimer = null;
        this.direction = Globals.DIRECTIONS["EAST"];
        this.state = null;
        this.x = x;
        this.y = y;

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, spriteName, 0).setOrigin(0.5, 0.5);
        this.sprite.parentEntity = this;

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(this.width - 2, this.height - 2);

        this.target = null;
        this.wanderTimer = null;
        this.detectionTimer = this.scene.time.addEvent({
            delay: this.data.detectionTime,
            callback: () => {
                if (Globals.DEBUG_MODE) this.debugDetection = this.scene.add.circle(this.x, this.y, this.data.detectionRadius).setStrokeStyle(2, 0xffff00);
                let bodies = this.scene.physics.overlapCirc(this.x, this.y, this.data.detectionRadius, true, false);
                bodies.forEach(b => {
                    if (b.gameObject.parentEntity !== undefined) {
                        if (b.gameObject.parentEntity.name === "Raptor" && this.data.affraid) {
                            this.setState("fear");
                        } else {
                            if (this.state === "fear")
                                this.setState("wander");
                        }
                    }
                });
                if (Globals.DEBUG_MODE) this.scene.time.delayedCall(100, () => { this.debugDetection.destroy(); }, [], this);
            },
            callbackScope: this,
            loop: true
        });

        this.setState("wander");
    }

    update() {
        this.x = this.sprite.x;
        this.y = this.sprite.y;

        if (this.target !== null) {
            let distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
            // Sprite direction
            this.sprite.flipX = this.x > this.target.x;

            if (distanceToTarget < 2) { // TOCHECK
                this.sprite.body.reset(this.target.x, this.target.y);
                // TODO :: Entity idle anim here
            }
        }
    }

    blink() {
        this.scene.time.addEvent({
            delay: Globals.BLINK_DELAY,
            callback: () => {
                if (this.sprite.tintTopLeft === 0xfafafa) this.sprite.clearTint();
                else this.sprite.setTintFill(0xfafafa);
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

    onHit() {
        this.isHit = true;
        if(!this.data.affraid) this.data.affraid = true;
        this.blink();
        this.resetBlinkTimer();
        this.blinkTimer = this.scene.time.delayedCall(Globals.BLINK_DELAY * Globals.BLINK_REPEAT, () => { this.isHit = false }, [], this);
        this.data.hp--;
        if (this.data.hp <= 0) {
            this.setState("dead");
            this.destroy();
        }
    }

    onCollide() {
        console.log("ON COLLIDE NOT SET :: Collide with " + this.name);
    }

    setState(state) {
        this.state = state;
        switch (state) {
            case "wander":
                this.wanderTimer = this.scene.time.delayedCall(Phaser.Math.Between(3000, 7000), () => {
                    this.target = { x: Phaser.Math.Between(-128, 128), y: Phaser.Math.Between(-128, 128) };
                    this.scene.physics.moveToObject(this.sprite, this.target, this.data.speed);
                    this.setState("wander");
                }, [], this);
                break;

            case "fear":
                if (this.wanderTimer !== null) this.wanderTimer.remove();
                this.wanderTimer = null;
                const a = Phaser.Math.Angle.Reverse(Phaser.Math.Angle.Between(this.x, this.y, this.scene.raptor.x, this.scene.raptor.y));
                this.target = { x: this.x + Math.cos(a) * (this.data.detectionRadius * 2), y: this.y + Math.sin(a) * (this.data.detectionRadius * 2) };
                this.scene.physics.moveToObject(this.sprite, this.target, this.data.speed * 1.5);
                break;

            case "dead":
                console.log("Dead");
                if (this.wanderTimer !== null) this.wanderTimer.remove();
                this.wanderTimer = null;
                if (this.detectionTimer !== null) this.detectionTimer.remove();
                this.detectionTimer = null;
                this.target = null;
                break;

            default:
                console.error("Unknown state");
                break;
        }
    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();
        // this.scene.entities.splice()
    }

}
import Phaser from "phaser";

import * as Globals from "../Globals";
import * as ParticleManager from "../ParticleManager";
import Entity from "./Entity";

export default class Raptor extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "raptor");

        this.sprite.setDepth(2);
        this.sprite.anims.create({
            key: "idle",
            frames: this.sprite.anims.generateFrameNames("raptor", { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
        this.sprite.anims.create({
            key: "walk",
            frames: this.sprite.anims.generateFrameNames("raptor", { start: 10, end: 20 }),
            frameRate: 12,
            repeat: -1
        });
        this.sprite.play("idle");

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;
    }

    handlePlayerControls() {
        // Keyboard controls
        let vx = 0;
        let vy = 0;
        const speed = 150;
        if (this.scene.cursors.left.isDown || this.scene.cursors.right.isDown || this.scene.cursors.up.isDown || this.scene.cursors.down.isDown) {

            if (this.scene.cursors.up.isDown)
                vy = -speed
            else if (this.scene.cursors.down.isDown)
                vy = speed

            if (this.scene.cursors.left.isDown) {
                vx = -speed
                this.sprite.flipX = true;
            } else if (this.scene.cursors.right.isDown) {
                vx = speed
                this.sprite.flipX = false;
            }

            if (vx !== 0 && vy !== 0) {
                vx = vx / 1.4142;
                vy = vy / 1.4142;
            }
            if (this.sprite.anims.currentAnim.key !== "walk")
                this.sprite.play("walk");
        } else {
            if (this.sprite.anims.currentAnim.key !== "idle")
                this.sprite.play("idle");
            // console.log(this.sprite.anims)
        }
        // if self.state ~= "action" then self.anim = self.animations.idle end

        // if (vx !== 0 || vy !== 0)
        this.sprite.setVelocity(vx, vy);
        // console.log(vx, vy)
    }

}
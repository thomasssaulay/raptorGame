import Phaser from "phaser";

import * as Globals from "../Globals";
import Item from "./Item";

export default class Raptor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.direction = Globals.DIRECTIONS["EAST"];

        // STATS
        this.name = "Raptor";
        this.speed = 110;
        this.attackCooldown = 750;
        this.canAttack = true;
        this.slashHitbox = {
            w: 8,
            h: 16
        };
        this.raptorHitbox = {
            w: 24,
            h: 20
        }

        this.sprite = this.scene.physics.add.sprite(this.x, this.y, "raptor", 0).setOrigin(0.5, 0.5);
        this.sprite.parentEntity = this;
        this.sprite.setDepth(2);
        this.sprite.anims.create({
            key: "idle",
            frames: this.sprite.anims.generateFrameNames("raptor", {
                start: 0,
                end: 3
            }),
            frameRate: Globals.ANIMATION_FRAMERATE,
            repeat: -1
        });
        this.sprite.anims.create({
            key: "walk",
            frames: this.sprite.anims.generateFrameNames("raptor", {
                start: 10,
                end: 19
            }),
            frameRate: Globals.ANIMATION_FRAMERATE,
            repeat: -1
        });
        this.sprite.play("idle");

        this.infoBox = this.scene.add.sprite(this.x, this.y - 16, "keys", 0).setOrigin(0.5, 0.5).setVisible(false).setDepth(10);
        this.infoBoxPick = this.scene.add.sprite(this.x, this.y - 32, "keys", 3).setOrigin(0.5, 0.5).setVisible(false).setDepth(10);
        this.infoBoxServe = this.scene.add.sprite(this.x, this.y - 32, "keys", 2).setOrigin(0.5, 0.5).setVisible(false).setDepth(10);

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.slashSprite = this.scene.physics.add.sprite(this.x, this.y, "slash", 0).setOrigin(0.5, 0.5).setDepth(3);
        this.slashSprite.anims.create({
            key: "slashing",
            frames: this.slashSprite.anims.generateFrameNames("slash", {
                start: 0,
                end: 4
            }),
            frameRate: Globals.ANIMATION_FRAMERATE,
            repeat: 0
        });
        this.slashSprite.on('animationcomplete', () => {
            this.slashSprite.setVisible(false);
            this.slashSprite.body.checkCollision.none = true;
        });
        this.slashSprite.play("slashing");

        this.sprite.body.setSize(this.raptorHitbox.w, this.raptorHitbox.h);
        this.sprite.body.setOffset(this.width / 2 - this.raptorHitbox.w / 2, this.height / 2);
        this.slashSprite.body.setSize(this.slashHitbox.w, this.slashHitbox.h);
        this.slashSprite.setVisible(false);
        this.slashSprite.body.checkCollision.none = true;

        this.nearestCounter = null;
        this.nearTruck = false;

        // Collision with map / borders / counters
        this.scene.physics.add.collider(this.sprite, this.scene.topLayer, null, null, this.scene);
        this.scene.counters.forEach(counter => {
            this.scene.physics.add.collider(this.sprite, counter.sprite, null, null, this.scene);
        });
        this.scene.physics.add.collider(this.sprite, this.scene.truck.sprite, null, null, this.scene);
        this.sprite.setCollideWorldBounds(true);
    }

    handlePlayerMovements() {
        let vx = 0;
        let vy = 0;
        if (this.scene.cursors.left.isDown || this.scene.cursors.right.isDown || this.scene.cursors.up.isDown || this.scene.cursors.down.isDown) { // Sets direction according to input
            if (this.scene.cursors.up.isDown) {
                vy = -this.speed;
                this.direction = Globals.DIRECTIONS["NORTH"]
            } else if (this.scene.cursors.down.isDown) {
                vy = this.speed;
                this.direction = Globals.DIRECTIONS["SOUTH"]
            }
            if (this.scene.cursors.left.isDown) {
                vx = -this.speed;
                this.sprite.flipX = true;
                this.direction = Globals.DIRECTIONS["WEST"]
            } else if (this.scene.cursors.right.isDown) {
                vx = this.speed;
                this.sprite.flipX = false;
                this.direction = Globals.DIRECTIONS["EAST"]
            }
            // Diagonals
            if (vx !== 0 && vy !== 0) {
                vx = vx / 1.4142;
                vy = vy / 1.4142;
            }
            // Set walk animation
            if (this.sprite.anims.currentAnim.key !== "walk")
                this.sprite.play("walk");

            // Adapt slash position
            this.slashSprite.setPosition(this.x + this.sprite.body.halfWidth + this.direction.x * this.sprite.body.sourceWidth, this.y + this.sprite.body.halfHeight + this.direction.y * this.sprite.body.sourceHeight);
            // Adapt slash direction
            if (this.direction === Globals.DIRECTIONS["WEST"])
                this.slashSprite.flipX = true;
            else
                this.slashSprite.flipX = false;

            if (this.direction === Globals.DIRECTIONS["NORTH"]) {
                this.slashSprite.body.rotation = -90;
                this.slashSprite.body.setSize(this.slashHitbox.h, this.slashHitbox.w);
            } else if (this.direction === Globals.DIRECTIONS["SOUTH"]) {
                this.slashSprite.body.rotation = 90;
                this.slashSprite.body.setSize(this.slashHitbox.h, this.slashHitbox.w);
            } else {
                this.slashSprite.body.rotation = 0;
                this.slashSprite.body.setSize(this.slashHitbox.w, this.slashHitbox.h);
            }

        } else { // Set idle animation if no inputs
            if (this.sprite.anims.currentAnim.key !== "idle")
                this.sprite.play("idle");



        }

        this.sprite.setVelocity(vx, vy);

        this.x = this.sprite.body.x;
        this.y = this.sprite.body.y;
    }

    handlePlayerControls() { // Attack
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.attack))
            if (this.canAttack)
                this.attack();

            // Place / Pickup / Mix / Serve
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.use)) {
            // Pick
            if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold === null && this.nearestCounter !== null && this.nearestCounter.hold !== null) {
                const item = this.nearestCounter.hold;
                this.scene.hud.addItemToInventory(item.name, item.chopped, item.contains);
                this.nearestCounter.hold.destroy();
                this.nearestCounter.hold = null;
            }
            // Place
            else if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null && this.nearestCounter !== null && this.nearestCounter.hold === null) {
                const item = this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold;
                this.scene.hud.removeCurrentItemFromInventory();
                this.nearestCounter.hold = new Item(this.scene, this.nearestCounter.x, this.nearestCounter.y - 10, item.name, false, item.chopped, item.contains);
            }
            // Mix
            else if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null && this.nearestCounter !== null && this.nearestCounter.hold !== null) {
                const itemInHand = this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold;
                const itemOnCounter = this.nearestCounter.hold;
                this.nearestCounter.hold.destroy();
                this.nearestCounter.hold = null;
                if (itemOnCounter.name !== "Box") {
                    this.nearestCounter.hold = new Item(this.scene, this.nearestCounter.x, this.nearestCounter.y - 10, "Box", false);
                    this.nearestCounter.hold.setBox();
                    this.nearestCounter.hold.contains.push(itemOnCounter.name)
                    this.nearestCounter.hold.contains.push(itemInHand.name);
                } else {
                    this.nearestCounter.hold = new Item(this.scene, this.nearestCounter.x, this.nearestCounter.y - 10, "Box", false, false, itemOnCounter.contains);
                    this.nearestCounter.hold.contains.push(itemInHand.name);
                }
                this.scene.hud.removeCurrentItemFromInventory();
            }
            // Serve
            if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null && this.nearTruck) {
                this.scene.hud.checkServing(this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold);
                this.scene.hud.removeCurrentItemFromInventory();
            }
        }

        // Action - Chop
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.action)) {
            if (this.nearestCounter)
                if (this.nearestCounter.hold !== null) {
                    if (!this.nearestCounter.hold.chopped && this.nearestCounter.hold.choppable) {
                        this.nearestCounter.hold.chop();
                    }
                }
        }

        // Drop
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.drop)) {
            if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold !== null) {
                this.scene.hud.removeCurrentItemFromInventory();
            }
        }

        // Debug
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.debug)) {
            if (this.scene.hud.HUDInventory[this.scene.hud.currentSlot].hold === null) {
                this.scene.hud.addItemToInventory("steak");
            }
            this.scene.hud.addOrder();
        }

        // Inventory
        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.one))
            if (this.scene.hud.currentSlot !== 0)
                this.scene.hud.onChangeCurrentSlot(0)

        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.two))
            if (this.scene.hud.currentSlot !== 1)
                this.scene.hud.onChangeCurrentSlot(1)

        if (Phaser.Input.Keyboard.JustDown(this.scene.keyboardBind.three))
            if (this.scene.hud.currentSlot !== 2)
                this.scene.hud.onChangeCurrentSlot(2)
    }

    attack() {
        this.slashSprite.setVisible(true);
        this.slashSprite.body.checkCollision.none = false;
        this.slashSprite.play("slashing");

        // Cooldown reseter
        this.canAttack = false;
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.canAttack = true;
        }, [], this);
    }

}
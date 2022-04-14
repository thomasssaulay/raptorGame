import Phaser from "phaser";

export default class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, spriteName) {
        super(scene);

        this.name = "Entity";
        this.scene = scene;

        this.x = x;
        this.y = y;

        this.spriteName = spriteName;
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, spriteName, 0).setOrigin(0.5, 0.5);
    }


    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.scene.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            ease: "Power2",
            duration: 700,
            onCompleteScope: this,
            onComplete: function() {
                // this.isMoving = false;
            }
        });
    }

    blink() {
        this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                if (this.sprite.tintTopLeft === this.color) this.sprite.clearTint();
                else this.sprite.setTint(this.color);
            },
            callbackScope: this,
            repeat: 5
        });
    }


    onCollide() {
        console.log("ON COLLIDE NOT SET :: Collide with " + this.name);
    }

    destroy() {
        if (this.sprite !== null)
            this.sprite.destroy();

        this.currentTile.contains = [];
    }

}
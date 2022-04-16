import Phaser from "phaser";

import * as Globals from "../Globals";
import * as ParticleManager from "../ParticleManager";
import Entity from "./Entity";

export default class Raptor extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, "dummy");

        // STATS
        this.name = "Dummy";
        this.speed = 10;

        this.sprite.setDepth(2);

        this.width = this.sprite.displayWidth;
        this.height = this.sprite.displayHeight;

        this.sprite.body.setSize(18, 28);
    }

}
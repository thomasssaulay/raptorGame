import Phaser from "phaser";
import LoadingBar from "../hud/LoadingBar";
import * as Globals from "../Globals";
import * as EntityManager from "../entities/EntityManager";
import Item from "../entities/Item";


export default class HudScene extends Phaser.Scene {
    constructor() {
        super({key: "Hud"});
    }

    create() {
        this.sceneMain = this.scene.get("SceneMain");

        this.height = this.cameras.main.height;
        this.width = this.cameras.main.width;

        this.sceneMain.events.on("updateHud", this.updateHud, this);

        this.HUDInventoryTitle = this.add.text(148, this.height - 64, "Inventory", {
            font: "10pt PearSoda",
            align: "left",
            color: Globals.PALETTE_HEX[9]
        }).setOrigin(0.5, 0.5);

        this.HUDInventory = [];
        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            this.HUDInventory.push(this.add.sprite(128 + i * 64, this.height - 32, "invSlot", 0).setOrigin(0.5, 0.5));
            this.HUDInventory[this.HUDInventory.length - 1].hold = null;
        }
    }

    initHudScene() {
        // UI
        // this.HUDTitle = this.add.text(150, 28, "LoopWorm", {
        //     font: "25pt PearSoda",
        //     align: "left",
        //     color: Globals.PALETTE_HEX[1]
        // }).setOrigin(0.5, 0.5);

        // Quit button
        // this.HUDQuit = this.add.sprite(this.width - 128, 36, "quit", 0).setOrigin(0.5, 0.5);
        // this.HUDQuit.anims.create({
        //     key: "idle",
        //     frames: this.HUDQuit.anims.generateFrameNames("quit", {
        //         start: 0,
        //         end: 2
        //     }),
        //     frameRate: 6,
        //     repeat: -1
        // });
        // this.HUDQuit.play("idle");
        // this.HUDQuit.setInteractive();
        // this.HUDQuit.on("pointerup", this.onQuitGame, this);
    }

    updateHud(event) {
        // Main update of the entire HUD

        // this.HUDLoopCounter.setText("LOOP " + this.sceneMain.worm.loopCount);
        // this.HUDWormSize.setText("SIZE " + this.sceneMain.worm.bodySize);
        // this.updateCards();

    }


    addItemToInventory(itemName) {
        console.log('Added ' + itemName + ' to inventory.');

        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            if (this.HUDInventory[i].hold === null) {
                this.HUDInventory[i].hold = new Item(this, this.HUDInventory[i].x, this.HUDInventory[i].y, itemName);
                break;
            }
        }
    }

    onQuitGame() {
        this.hud = this.sceneMain.scene.stop("Hud");
        this.sceneMain.scene.start("SceneMainMenu");
    }
}

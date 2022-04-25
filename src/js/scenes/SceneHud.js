import Phaser from "phaser";
import LoadingBar from "../hud/LoadingBar";
import * as Globals from "../Globals";
import Item from "../entities/Item";


export default class HudScene extends Phaser.Scene {
    constructor() {
        super({ key: "Hud" });
    }

    create() {
        this.sceneMain = this.scene.get("SceneMain");

        this.height = this.cameras.main.height;
        this.width = this.cameras.main.width;

        this.sceneMain.events.on("updateHud", this.updateHud, this);

        // this.HUDInventoryTitle = this.add.text(148, this.height - 64, "Inventory", {
        //     font: "10pt rainyhearts",
        //     align: "left",
        //     color: Globals.PALETTE_HEX[9]
        // }).setOrigin(0.5, 0.5);

        // Inventory
        this.HUDInventory = [];
        this.HUDInventoryText = [];
        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            this.HUDInventory.push(this.add.sprite(352 + i * 64, this.height - 56, "invSlot", 0).setOrigin(0.5, 0.5));
            this.HUDInventory[this.HUDInventory.length - 1].hold = null;
            this.HUDInventoryText.push(this.add.sprite(352 + i * 64, this.height - 34, "numbers", i).setOrigin(0.5, 0.5));
        }
        this.emptyInventorySlot = Globals.INVENTORY_SPACE;

        // Orders
        this.HUDOrders = [];
        for (let i = 0; i < Globals.MAX_ORDERS; i++) {
            this.HUDOrders.push(this.add.container(64 + i * 96, -48));
            this.HUDOrders[this.HUDOrders.length - 1].add(this.add.sprite(0, 0, "orderCard", 0).setOrigin(0.5, 0.5));
            this.HUDOrders[this.HUDOrders.length - 1].add(this.add.text(0, -32, "NAME", {
                font: "14pt rainyhearts",
                align: "center",
                color: "#272736"
            }).setOrigin(0.5, 0.5));
            this.HUDOrders[this.HUDOrders.length - 1].add(this.add.text(0, 12, "RECIPE", {
                font: "12pt rainyhearts",
                align: "center",
                color: "#272736"
            }).setOrigin(0.5, 0.5));
            this.HUDOrders[this.HUDOrders.length - 1].bar = new LoadingBar(this, 64 + i * 96, -48, 100, 100, 64, 16);
            this.HUDOrders[this.HUDOrders.length - 1].index = i;
            this.HUDOrders[this.HUDOrders.length - 1].active = false;
        }
        this.activeOrders = 0;

        this.onChangeCurrentSlot(0);
    }

    updateHud(event) {
        // Main update of the entire HUD
    }

    onChangeCurrentSlot(num) {
        this.tweens.add({
            targets: [this.HUDInventory[this.currentSlot], this.HUDInventoryText[this.currentSlot]],
            scale: 1,
            ease: 'Sine.easeInOut',
            duration: 100,
            repeat: 0
        });
        this.tweens.add({
            targets: this.HUDInventoryText[this.currentSlot],
            y: this.height - 34,
            ease: 'Sine.easeInOut',
            duration: 100,
            repeat: 0
        });

        this.currentSlot = num;

        this.tweens.add({
            targets: [this.HUDInventory[this.currentSlot], this.HUDInventoryText[this.currentSlot]],
            scale: 1.25,
            ease: 'Sine.easeInOut',
            duration: 100,
            repeat: 0
        });
        this.tweens.add({
            targets: this.HUDInventoryText[this.currentSlot],
            y: this.height - 28,
            ease: 'Sine.easeInOut',
            duration: 100,
            repeat: 0
        });
    }

    addOrder() {
        this.activeOrders++;
        let availableSlot = false;

        const meal = Phaser.Math.RND.pick(Globals.MEALS);

        this.HUDOrders.forEach(order => {
            if (!order.active && !availableSlot) {

                order.name = meal.name;
                order.recipe = meal.recipe;
                order.time = meal.time;
                order.list[1].setText(meal.name)
                order.list[2].setText(meal.recipe)

                availableSlot = true;
                order.active = true;

                // Start order timer
                order.timer = this.time.addEvent({
                    delay: order.time / 100,
                    callback: () => {
                        order.bar.setPercent(1 - order.timer.getOverallProgress())
                        if (1 - order.timer.getOverallProgress() === 0) {
                            console.log("finito")
                            this.removeOrder(order.index)
                        }

                    },
                    repeat: 99
                });

                // Anims
                this.tweens.add({
                    targets: order,
                    y: 64,
                    ease: 'Bounce.easeOut',
                    duration: 1000,
                    repeat: 0,
                });
                this.tweens.add({
                    targets: [order.bar.bar, order.bar.bg],
                    y: 168,
                    ease: 'Bounce.easeOut',
                    duration: 1000,
                    repeat: 0,
                });
            }
        });
    }

    removeOrder(n) {
        this.activeOrders--;
        const order = this.HUDOrders[n];
        order.active = false;

        this.tweens.add({
            targets: order,
            y: -64,
            ease: 'Bounce.easeIn',
            duration: 1000,
            repeat: 0,
        });
        this.tweens.add({
            targets: [order.bar.bar, order.bar.bg],
            y: -48,
            ease: 'Bounce.easeOut',
            duration: 1000,
            repeat: 0,
        });
    }

    addItemToInventory(itemName, chopped, contains = []) {
        console.log('Added ' + itemName + ' to inventory.');

        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            if (this.HUDInventory[i].hold === null) {
                this.HUDInventory[i].hold = new Item(this, this.HUDInventory[i].x, this.HUDInventory[i].y, itemName, true, chopped, contains);
                this.emptyInventorySlot--;
                break;
            }
        }
    }

    removeCurrentItemFromInventory() {
        console.log('Deleted ' + this.HUDInventory[this.currentSlot].hold.name + ' of inventory.');

        this.HUDInventory[this.currentSlot].hold.destroy();
        this.HUDInventory[this.currentSlot].hold = null;
        this.emptyInventorySlot++;
    }

    checkServing(item) {
        const serving = item.name !== "Box" ? item.name : item.contains.sort().join(',');

        console.log("Currently holding :: " + serving);

        let found = false;
        this.HUDOrders.forEach((order, i) => {
            if (order.active && !found) {
                const orderRecipe = order.recipe.sort().join(',');
                console.log("Order " + i + " :: " + orderRecipe);
                if (serving === orderRecipe) {
                    console.warn("Matching, removing order " + i);
                    this.removeOrder(i);
                    found = true;
                }
            }
        });
    }

    onQuitGame() {
        this.hud = this.sceneMain.scene.stop("Hud");
        this.sceneMain.scene.start("SceneMainMenu");
    }
}
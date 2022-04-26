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

        this.score = 0;

        // Inventory
        this.HUDInventory = [];
        this.HUDInventoryText = [];
        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            const offset = this.width / 2 - (Globals.INVENTORY_SPACE * 64) / 4;
            this.HUDInventory.push(this.add.sprite(offset + i * 64, this.height - 56, "invSlot", 0).setOrigin(0.5, 0.5));
            this.HUDInventory[this.HUDInventory.length - 1].hold = null;
            this.HUDInventoryText.push(this.add.sprite(offset + i * 64, this.height - 34, "numbers", i).setOrigin(0.5, 0.5));
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
                font: "10pt rainyhearts",
                align: "center",
                color: "#272736"
            }).setOrigin(0.5, 0.5));
            this.HUDOrders[this.HUDOrders.length - 1].bar = new LoadingBar(this, 64 + i * 96, -48, 100, 100, 64, 12);
            this.HUDOrders[this.HUDOrders.length - 1].index = i;
            this.HUDOrders[this.HUDOrders.length - 1].active = false;
            // this.HUDOrders[this.HUDOrders.length - 1].setScale(0.75);
        }
        this.activeOrders = 0;

        this.newOrderTimer = this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.addOrder();
                this.resetNewOrderTimer();
            },
            repeat: 0
        });


        // Score
        this.HUDScore = this.add.sprite(this.width - 64, this.height - 64, "scoreCard", 0).setOrigin(0.5, 0.5);
        this.HUDScoreText = this.add.text(this.width - 64, this.height - 50, "0", {
            font: "14pt rainyhearts",
            align: "center",
            color: "#272736"
        }).setOrigin(0.5, 0.5);

        // Time Left
        this.HUDTime = this.add.sprite(64, this.height - 64, "timeCard", 0).setOrigin(0.5, 0.5);
        this.HUDTimeText = this.add.text(64, this.height - 50, Globals.GAME_TIME / 1000, {
            font: "14pt rainyhearts",
            align: "center",
            color: "#272736"
        }).setOrigin(0.5, 0.5);

        this.gameTimer = this.time.addEvent({
            delay: Globals.GAME_TIME,
            callback: () => {
                console.log("GAME OVER")
            },
            repeat: 0
        });
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.HUDTimeText.setText(Math.round(this.gameTimer.getRemainingSeconds()));
            },
            repeat: Globals.GAME_TIME - 1
        });

        this.onChangeCurrentSlot(0);
    }

    addScore(amount) {
        this.score += amount;
        this.HUDScoreText.setText(this.score);
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
                order.time = meal.time * this.sceneMain.difficultyMultiplier;
                order.score = meal.score;

                let recipeToString = "";
                meal.recipe.forEach((el) => recipeToString += el + "\n+ ");
                recipeToString = recipeToString.substring(0, recipeToString.length - 3);

                order.list[1].setText(meal.name)
                order.list[2].setText(recipeToString)

                availableSlot = true;
                order.active = true;

                // Start order timer
                order.timer = this.time.addEvent({
                    delay: order.time / 100,
                    callback: () => {
                        order.bar.setPercent(1 - order.timer.getOverallProgress() + 0.01)
                        if (1 - order.timer.getOverallProgress() === 0) {
                            this.addScore(Globals.SCORE_ORDER_MISSED);
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

    resetNewOrderTimer() {
        this.newOrderTimer.remove();
        this.newOrderTimer = null;
        this.newOrderTimer = this.time.addEvent({
            delay: Phaser.Math.Between(Globals.MIN_NEW_ORDER_TIME, Globals.MAX_NEW_ORDER_TIME),
            callback: () => {
                this.addOrder();
                this.resetNewOrderTimer();
            },
            repeat: 0
        });
    }

    addItemToInventory(itemName, chopped, contains = []) {
        console.log('Added ' + itemName + ' to inventory.');

        for (let i = 0; i < Globals.INVENTORY_SPACE; i++) {
            if (this.HUDInventory[i].hold === null) {
                this.HUDInventory[i].hold = new Item(this, this.HUDInventory[i].x, this.HUDInventory[i].y, itemName, true, chopped, contains);
                this.HUDInventory[i].hold.sprite.setScale(2)
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
                    this.addScore(order.score);
                    found = true;
                }
            }
        });

        if (!found) {
            console.warn("Wrong serving !")
            this.addScore(Globals.SCORE_WRONG_SERVING);
        }
    }

    onQuitGame() {
        this.hud = this.sceneMain.scene.stop("Hud");
        this.sceneMain.scene.start("SceneMainMenu");
    }
}
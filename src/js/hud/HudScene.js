import Phaser from "phaser";
import LoadingBar from "./LoadingBar";
import Card from "./Card";
import * as Globals from "../Globals";
import * as EntityManager from "../entities/EntityManager";


export default class HudScene extends Phaser.Scene {
    constructor() {
        super({ key: "Hud", active: true });
    }

    create() {
        this.sceneMain = this.scene.get("SceneMain");

        this.height = this.cameras.main.height;
        this.width = this.cameras.main.width;

        this.sceneMain.events.on("updateHud", this.updateHud, this);
    }

    initHudScene() {
        //  UI
        this.HUDTitle = this.add
            .text(150, 28, "LoopWorm", {
                font: "25pt PearSoda",
                align: "left",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDLoopCounter = this.add
            .text(130, 48, "LOOP 0", {
                font: "14pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDWormSize = this.add
            .text(184, 48, "SIZE 0", {
                font: "14pt PearSoda",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.scaleAnim = null;
        this.HUDQuit = this.add
            .sprite(this.width - 128, 36, "quit", 0)
            .setOrigin(0.5, 0.5);

        // Next wave
        this.HUDWaveText = this.add
            .text(this.width / 2, 28, "NEXT WAVE", {
                font: "14pt PearSoda",
                align: "center",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDWaveBar = new LoadingBar(this, this.width / 2, 48, 0, 100, 256, 16);
        this.nextWaveTime = Globals.START_WAVE_TIMER;
        this.waveTimer = null;
        this.startWaveTimer();

        // Cards related
        this.HUDCardInfoBack = this.add
            .sprite(this.width - 96, this.height + 64, "infocard", 0)
            .setOrigin(0.5, 0.5);
        this.HUDCardInfoText = this.add
            .text(this.width - 96, this.height + 64, "", {
                font: "14pt PearSoda",
                align: "center",
                color: Globals.PALETTE_HEX[1]
            })
            .setOrigin(0.5, 0.5);
        this.HUDCards = [];
        this.addCard("Orb");
        this.addCard("Fog");
        this.addCard("Dispenser");
        this.addCard("Pill");
        this.addCard("Wart");
        this.addCard("Mushroom");
        this.addCard("Crystal");
        this.HUDCards.forEach((card) => {
            card.refresh();
        });

        this.HUDCardInfoBack.setTexture("infocard").setScale(1.5);
        this.HUDCardInfoBack.anims.create({
            key: "idle",
            frames: this.HUDCardInfoBack.anims.generateFrameNames("infocard", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.HUDCardInfoBack.play("idle");
        this.cardInfoAnim = false;

        // Quit button
        this.HUDQuit.setTexture("quit");
        this.HUDQuit.anims.create({
            key: "idle",
            frames: this.HUDQuit.anims.generateFrameNames("quit", {
                start: 0,
                end: 2
            }),
            frameRate: 6,
            repeat: -1
        });
        this.HUDQuit.play("idle");
        this.HUDQuit.setInteractive();
        this.HUDQuit.on("pointerup", this.onQuitGame, this);
    }

    updateHud(event) {
        // Main update of the entire HUD

        this.HUDLoopCounter.setText("LOOP " + this.sceneMain.worm.loopCount);
        this.HUDWormSize.setText("SIZE " + this.sceneMain.worm.bodySize);
        this.updateCards();

    }

    updateCards() {
        // Show/hide cards depending on worm size
        this.HUDCards.forEach(c => {
            if (c.data.price > this.sceneMain.worm.bodySize)
                c.hide();
            else
                c.show();
        });
    }

    onToggleBuild(card) {
        // Build mode activated when player has clicked on a card
        // This strores the clicked car in a main scene variable and do stuff accordingly
        if (card.isEnabled) {
            if (this.sceneMain.buildCard === false) {
                this.sceneMain.buildCard = card;
                card.setActive(true);
                this.input.setDefaultCursor("crosshair");
                this.showCardInfo(card);
                if (card.data.cardType === "coastal") this.showCoastal();
                if (card.data.cardType === "land") this.showLand();
                if (card.data.cardType === "path" && !card.data.eraser) this.showPath();
            } else {
                this.hideCardInfo();
                this.toggleBuildOff();
                card.setActive(false);
                this.hideLand();
                this.hidePath();
            }
        } else {
            if (card.isShown) {
                card.shake();
            }
        }
    }
    toggleBuildOff() {
        this.sceneMain.buildCard = false;

        this.hideLand();
        this.hidePath();
        this.input.setDefaultCursor("default");
    }
    showLand() {
        this.sceneMain.availableLandTiles.forEach((t) => {
            t.hilightSprite.setAlpha(1);
        });
    }
    hideLand() {
        this.sceneMain.availableLandTiles.forEach((t) => {
            t.hilightSprite.setAlpha(0);
        });
    }
    showCoastal() {
        this.sceneMain.availableCoastalTiles.forEach((t) => {
            t.hilightSprite.setAlpha(1);
        });
    }
    hideCoastal() {
        this.sceneMain.availableCoastalTiles.forEach((t) => {
            t.hilightSprite.setAlpha(0);
        });
    }
    showPath() {
        this.sceneMain.availablePathIncludingWorm.forEach((t) => {
            t.hilightSprite.setAlpha(1);
        });
    }
    hidePath() {
        this.sceneMain.path.forEach((t) => {
            t.hilightSprite.setAlpha(0);
        });
    }

    addCard(cardName) {
        const offset_x = 64;
        const offset_gap = 86;
        const newCard = new Card(
            this,
            offset_x + offset_gap * this.HUDCards.length,
            this.height + 64,
            cardName
        );
        this.HUDCards.push(newCard);
        this.HUDCards[this.HUDCards.length - 1].hide();
    }

    showCardInfo(card) {
        if (!this.cardInfoAnim) {
            this.sceneMain.tweens.add({
                targets: [this.HUDCardInfoBack, this.HUDCardInfoText],
                y: "-=128",
                ease: "Bounce",
                duration: 500,
                onCompleteScope: this,
                onComplete: function() {
                    this.cardInfoAnim = true;
                }
            });
            this.HUDCardInfoText.setText(card.data.info);
        }
    }
    hideCardInfo() {
        if (this.cardInfoAnim) {
            this.sceneMain.tweens.add({
                targets: [this.HUDCardInfoBack, this.HUDCardInfoText],
                y: "+=128",
                ease: "Bounce",
                duration: 500,
                onCompleteScope: this,
                onComplete: function() {
                    this.cardInfoAnim = false;
                }
            });
        }
    }
    startWaveTimer() {
        this.waveTimer = this.time.addEvent({
            delay: this.nextWaveTime / 200,
            callback: () => {
                this.HUDWaveBar.setPercent(this.waveTimer.getOverallProgress())
                if (this.waveTimer.getOverallProgress() === 1)
                    this.onNextWave();

            },
            callbackScope: this,
            repeat: 200
        });
    }
    stopWaveTimer() {
        this.time.removeEvent(this.waveTimer);
    }
    disableAllCards() {
        this.HUDCards.forEach((c) => {
            c.disable();
        });
    }
    enableAllCards() {
        this.HUDCards.forEach((c) => {
            c.enable();
        });
    }
    scaleUpDownAnim(target) {
        // this.scaleAnim.stop(0);
        if (this.scaleAnim === null)
            this.scaleAnim = this.tweens.add({
                targets: target,
                scale: 1.3,
                yoyo: true,
                repeat: 2,
                ease: "Power2",
                duration: 100
            });
        if (this.scaleAnim.totalProgress === 1) {
            this.scaleAnim.pause(0);
            this.scaleAnim.play(0);
        }
    }
    onNextWave() {
        const nSpawn = this.sceneMain.data.difficulty * Phaser.Math.Between(1, 2) + Math.floor(this.sceneMain.worm.loopCount / 6) + Phaser.Math.Between(0, (this.sceneMain.data.difficulty + 1));

        for (let i = 0; i < nSpawn; i++) {
            EntityManager.spawnAtRandom(this.sceneMain, "norb", this.sceneMain.availablePathExludingWorm);
        }

        // console.warn("NEXT WAVE ! " + nSpawn + " NORBS SPAWNED !");

        const spikeChance = (this.sceneMain.data.difficulty + 1) * 0.2;

        if (this.sceneMain.worm.loopCount >= Globals.MIN_LOOP_TO_SPAWN_SPIKES && Math.random() < spikeChance) {
            EntityManager.spawnAtRandom(this.sceneMain, "spike", this.sceneMain.availablePathExludingWorm);
            // console.warn("AND ONE SPIKE");
        }
        this.startWaveTimer();
    }
    onQuitGame() {
        this.hud = this.sceneMain.scene.stop("Hud");
        this.sceneMain.scene.start("SceneMainMenu");
    }
}
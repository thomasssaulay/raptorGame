/**
 * Author: Thomas SAULAY
 */

import Phaser from 'phaser';

import * as Globals from "./js/Globals";
import SceneGameOver from "./js/scenes/SceneGameOver";
import SceneMainMenu from "./js/scenes/SceneMainMenu";
import SceneMain from "./js/scenes/SceneMain";
import SceneHud from "./js/scenes/SceneHud";

const config = {
    type: Phaser.AUTO,
    mode: Phaser.Scale.ScaleModes.FIT,
    parent: 'game-container',
    width: 800, // 400 * 300 w/ zoom:2
    height: 600,
    backgroundColor: "#323e4f",
    zoom: 1,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: Globals.DEBUG_MODE,
            gravity: {
                y: 0
            }
        }
    },
    scene: [SceneMainMenu, SceneMain, SceneGameOver, SceneHud]
};

const game = new Phaser.Game(config);
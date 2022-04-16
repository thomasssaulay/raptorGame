/**
 * Author: Thomas SAULAY
 */

import Phaser from 'phaser';

import * as Globals from "./js/Globals";
import SceneGameOver from "./js/scenes/SceneGameOver";
import SceneMainMenu from "./js/scenes/SceneMainMenu";
import SceneMain from "./js/scenes/SceneMain";

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 400,
    height: 300,
    backgroundColor: "#323e4f",
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: Globals.DEBUG_MODE,
            gravity: { y: 0 }
        }
    },
    scene: [SceneMainMenu, SceneMain, SceneGameOver]
};

const game = new Phaser.Game(config);
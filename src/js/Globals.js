import Phaser from "phaser";

// DEBUG
export const DEBUG_MODE = false;
export const ENABLE_LIGHTS = true;

// GAME CONSTANTS
export const ANIMATION_FRAMERATE = 8;
export const BLINK_DELAY = 250;
export const BLINK_REPEAT = 5;
export const INVENTORY_SPACE = 3;
export const MAX_ORDERS = 6;
export const MIN_EGG_SPAWN_TIME = 30000;
export const MAX_EGG_SPAWN_TIME = 60000;
export const MAX_EGGS = 9;
export const MIN_NEW_ORDER_TIME = 15000;
export const MAX_NEW_ORDER_TIME = 30000;
export const BERRYBUSH_COOLDOWN = 10000;
export const GAME_TIME = 180000;
export const SCORE_ORDER_MISSED = -300;
export const SCORE_WRONG_SERVING = -150;


export const ENTITIES = {
    "dummy": {
        "name": "Dummy",
        "color": 0x272736,
        "detectionTime": 1000,
        "detectionRadius": 50,
        "speed": 10,
        "drops": "",
        "dropsMax": 3,
        "hp": 9999
    },
    "sheep": {
        "name": "Sheep",
        "color": 0xffffeb,
        "detectionTime": 600,
        "detectionRadius": 100,
        "affraid": false,
        "speed": 50,
        "drops": "lamb",
        "dropsMax": 2,
        "hp": 5
    },
    "chicken": {
        "name": "Chicken",
        "color": 0xf2a65e,
        "detectionTime": 400,
        "detectionRadius": 70,
        "affraid": true,
        "speed": 55,
        "drops": "chicken",
        "dropsMax": 3,
        "hp": 3
    },
    "pig": {
        "name": "Pig",
        "color": 0xffb5b5,
        "detectionTime": 400,
        "detectionRadius": 120,
        "affraid": false,
        "speed": 55,
        "drops": "pork",
        "dropsMax": 2,
        "hp": 4
    }
}

export const ITEMS = [
    "box", "closed box", "lamb", "chopped lamb", "chicken", "chopped chicken", "pork", "chopped pork", "egg", "berry"
]

export const MEALS = [
    { "name": "Tartare", "recipe": ["chopped lamb", "egg"], "time": 50000, "score": 500 },
    { "name": "lamb XL", "recipe": ["lamb", "lamb"], "time": 50000, "score": 300 },
    { "name": "Big Ribs", "recipe": ["pork", "pork"], "time": 20000, "score": 400 },
    { "name": "Egg Salad", "recipe": ["egg", "berry"], "time": 40000, "score": 250 },
    { "name": "Parisa", "recipe": ["chopped lamb", "chopped pork", "berry"], "time": 70000, "score": 750 },
    { "name": "Kibbeh", "recipe": ["chopped pork", "berry"], "time": 40000, "score": 450 },
    { "name": "Toriwasa", "recipe": ["chicken", "egg"], "time": 40000, "score": 500 },
    { "name": "Bucket", "recipe": ["chicken", "chicken"], "time": 30000, "score": 250 },
    { "name": "Bucket XL", "recipe": ["chicken", "chicken", "chicken"], "time": 20000, "score": 300 },
]


export const DIRECTIONS = {
    "EAST": new Phaser.Math.Vector2(1, 0),
    "SOUTH": new Phaser.Math.Vector2(0, 1),
    "WEST": new Phaser.Math.Vector2(-1, 0),
    "NORTH": new Phaser.Math.Vector2(0, -1)
}

export const PALETTE = [
    "0x5e315b",
    "0x8c3f5d",
    "0xba6156",
    "0xf2a65e",
    "0xffe478",
    "0xcfff70",
    "0x8fde5d",
    "0x3ca370",
    "0x3d6e70",
    "0x323e4f",
    "0x322947",
    "0x473b78",
    "0x4b5bab",
    "0x4da6ff",
    "0x66ffe3",
    "0xffffeb",
    "0xc2c2d1",
    "0x7e7e8f",
    "0x606070",
    "0x43434f",
    "0x272736",
    "0x3e2347",
    "0x57294b",
    "0x964253",
    "0xe36956",
    "0xffb570",
    "0xff9166",
    "0xeb564b",
    "0xb0305c",
    "0x73275c",
    "0x422445",
    "0x5a265e",
    "0x80366b",
    "0xbd4882",
    "0xff6b97",
    "0xffb5b5",
]

export const PALETTE_HEX = [
    "#5e315b",
    "#8c3f5d",
    "#ba6156",
    "#f2a65e",
    "#ffe478",
    "#cfff70",
    "#8fde5d",
    "#3ca370",
    "#3d6e70",
    "#323e4f",
    "#322947",
    "#473b78",
    "#4b5bab",
    "#4da6ff",
    "#66ffe3",
    "#ffffeb",
    "#c2c2d1",
    "#7e7e8f",
    "#606070",
    "#43434f",
    "#272736",
    "#3e2347",
    "#57294b",
    "#964253",
    "#e36956",
    "#ffb570",
    "#ff9166",
    "#eb564b",
    "#b0305c",
    "#73275c",
    "#422445",
    "#5a265e",
    "#80366b",
    "#bd4882",
    "#ff6b97",
    "#ffb5b5",
];

export function manhattan(x1, x2, y1, y2) {
    const d1 = Math.abs(x2 - x1);
    const d2 = Math.abs(y2 - y1);
    return d1 + d2;
}
export function distance(x1, x2, y1, y2) {
    return Math.sqrt((x2 - x1) ^ 2 + (y2 - y1) ^ 2)
}
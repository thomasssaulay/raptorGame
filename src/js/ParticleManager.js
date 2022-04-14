import * as Globals from "./Globals";

export function emitHurtParticles(scene, target) {
    let particles = scene.add
        .particles("spike_particle")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -100, max: 200 },
            lifespan: 500,
            scale: { start: 1, end: 0.0 },
            blendMode: "NORMAL",
            quantity: 5,
            on: true
        });
    particles.explode();
}
export function emitHealParticles(scene, target) {
    let particles = scene.add
        .particles("orb")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -50, max: 50 },
            lifespan: 1500,
            scale: { start: 1, end: 0.0 },
            blendMode: "NORMAL",
            quantity: 10,
            on: true
        });
    particles.explode();
}

export function emitDeathParticles(scene, target) {
    let particles = scene.add
        .particles("orb")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -50, max: 50 },
            lifespan: 2000,
            scale: { start: 4, end: 0.0 },
            blendMode: "NORMAL",
            quantity: 40,
            on: true
        });
    particles.explode();
}

export function emitBuildarticles(scene, target) {
    let particles = scene.add
        .particles("orb")
        .setDepth(5)
        .createEmitter({
            x: target.x,
            y: target.y,
            angle: { min: 0, max: 360 },
            speed: { min: -50, max: 50 },
            lifespan: 1000,
            gravityY: 120,
            scale: { start: 1.5, end: 0.0 },
            blendMode: "NORMAL",
            quantity: 20,
            on: true
        });
    particles.explode();
}

export function emitMovingParticlesToTarget(
    scene,
    target,
    destination,
    qt = 5
) {
    let spriteList = [];
    for (let i = 0; i < qt; i++) {
        const randSize = Math.random() * (0.8 - 0.3) + 0.3;
        spriteList.push(scene.add.sprite(target.x, target.y, "orb"));
        spriteList[i]
            .setDepth(5)
            .setScale(randSize)
            .setVisible(false);
        scene.tweens.add({
            targets: spriteList[i],
            x: destination.x,
            y: destination.y,
            delay: 500 + i * 50,
            ease: "Power2",
            duration: 1500,
            onStart: function(tween, targets) {
                targets[0].setVisible(true);
            },
            onComplete: function(tween, targets) {
                targets[0].destroy();
            }
        });
    }
}
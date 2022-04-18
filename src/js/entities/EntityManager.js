import Entity from "./Entity";

export function spawn(scene, ent, x, y) {
    scene.entities.push(new Entity(scene, x, y, ent));

    scene.physics.add.overlap(scene.raptor.slashSprite, scene.entities[scene.entities.length - 1].sprite, (slash, ent) => ent.onCollideWithRaptor(slash, ent));
}

export function spawnGroup(scene, ent, amount, x, y, w, h) {
    for (let i = 0; i < amount; i++) {
        scene.entities.push(new Entity(scene, Phaser.Math.Between(x, x + w), Phaser.Math.Between(y, y + h), ent));

        scene.physics.add.overlap(scene.raptor.slashSprite, scene.entities[scene.entities.length - 1].sprite, (collider, ent) => ent.parentEntity.onCollideWithRaptor());
    }
}

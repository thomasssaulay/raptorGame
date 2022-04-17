import Entity from "./Entity";

export function spawnEntity(scene, ent, amount) {
    for (let i = 0; i < amount; i++) {
        scene.entities.push(new Entity(scene, Phaser.Math.Between(-64, 64), Phaser.Math.Between(-64, 64), ent));

        scene.physics.add.overlap(scene.raptor.slashSprite, scene.entities[scene.entities.length - 1].sprite, function (slash, ent) {
            if (! ent.parentEntity.isHit) {
                console.log(ent.body.velocity)

                const scene = ent.parentEntity.scene;
                const knockback = 35;

                const a = Phaser.Math.Angle.Reverse(Phaser.Math.Angle.Between(ent.parentEntity.x, ent.parentEntity.y, scene.raptor.x, scene.raptor.y));
                ent.parentEntity.target = {
                    x: ent.x + Math.cos(a) * knockback,
                    y: ent.y + Math.sin(a) * knockback
                };
                scene.physics.moveToObject(ent, ent.parentEntity.target, ent.parentEntity.data.speed * 5);

                ent.parentEntity.onHit();
            }
        });
    }
}

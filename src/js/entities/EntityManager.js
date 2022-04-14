import Orb from "./Orb";
import Norb from "./Norb";
import Spike from "./Spike";

export function spawnAtRandom(scene, ent, tileList) {
    let randomTile = null;

    if (tileList !== null && tileList !== [] && tileList !== undefined && tileList.length > 1) {
        randomTile = Phaser.Math.RND.pick(tileList);
        switch (ent) {
            case "spike":
                scene.spikes.push(new Spike(scene, randomTile));
                randomTile.contains.push(scene.spikes[scene.spikes.length - 1]);
                break;
            case "orb":
                scene.orbs.push(new Orb(scene, randomTile));
                randomTile.contains.push(scene.orbs[scene.orbs.length - 1]);
                break;
            case "norb":
                scene.norbs.push(new Norb(scene, randomTile));
                randomTile.contains.push(scene.norbs[scene.norbs.length - 1]);
                break;

            default:
                console.error("Tried to spawn unknown entity.")
                break;
        }
    }
}
export function spawnEntity(scene, ent, tile) {
    if (tile !== null && tile !== [] && tile !== undefined) {
        switch (ent) {
            case "spike":
                scene.spikes.push(new Spike(scene, tile));
                tile.contains.push(scene.spikes[scene.spikes.length - 1]);
                break;
            case "orb":
                scene.orbs.push(new Orb(scene, tile));
                tile.contains.push(scene.orbs[scene.orbs.length - 1]);
                break;
            case "norb":
                scene.norbs.push(new Norb(scene, tile));
                tile.contains.push(scene.norbs[scene.norbs.length - 1]);
                break;
            case "fragment":
                scene.orbs.push(new Orb(scene, tile, true));
                tile.contains.push(scene.orbs[scene.orbs.length - 1]);
                break;

            default:
                console.error("Tried to spawn unknown entity.")
                break;
        }
    }
}
// export function spawnOrb(scene, tile) {
//     if (tile !== null && tile !== [] && tile !== undefined) {
//         scene.orbs.push(new Orb(scene, tile));
//         tile.contains.push(scene.orbs[scene.orbs.length - 1]);
//     }
// }
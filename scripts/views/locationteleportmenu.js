import { world, } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
class LocationTeleportMenu {
    static DimensionList = ['主世界', '地狱', '末地'];
    constructor(player) {
        const { x, y, z } = player.location;
        new ModalFormData()
            .title('坐标传送器')
            .textField('X轴', '', String(Math.floor(x)))
            .textField('Y轴', '', String(Math.floor(y)))
            .textField('Z轴', '', String(Math.floor(z)))
            .dropdown('维度', LocationTeleportMenu.DimensionList, this.getPlayerDimension(player))
            .show(player)
            .then(({ formValues }) => {
            if (formValues) {
                try {
                    const [x, y, z] = [
                        Number(formValues[0]),
                        Number(formValues[1]),
                        Number(formValues[2]),
                    ];
                    const dimension = this.parseDimension(Number(formValues[3]));
                    const { x: rx, y: ry } = player.rotation;
                    if (!(isNaN(x) && isNaN(y) && isNaN(z))) {
                        player.teleport({
                            x,
                            y,
                            z,
                        }, dimension, rx, ry);
                    }
                }
                catch (err) { }
            }
        });
    }
    parseDimension(index) {
        let dimension;
        switch (index) {
            case 0:
                dimension = 'minecraft:overworld';
                break;
            case 1:
                dimension = 'minecraft:nether';
                break;
            case 2:
                dimension = 'minecraft:the_end';
                break;
            default:
                dimension = 'minecraft:overworld';
        }
        return world.getDimension(dimension);
    }
    getPlayerDimension(player) {
        switch (player.dimension.id) {
            case 'minecraft:overworld':
                return 0;
            case 'minecraft:nether':
                return 1;
            case 'minecraft:the_end':
                return 2;
            default:
                return 0;
        }
    }
}
export default LocationTeleportMenu;

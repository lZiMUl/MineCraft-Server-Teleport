import {
    Dimension,
    Location,
    Player,
    world,
    XYRotation,
} from '@minecraft/server';
import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';

class LocationTeleportMenu<T extends Player> {
    private static DimensionList: string[] = ['主世界', '地狱', '末地'];
    public constructor(player: T) {
        const { x, y, z }: Location = player.location;
        new ModalFormData()
            .title('坐标传送器')
            .textField('X轴', '', String(Math.floor(x)))
            .textField('Y轴', '', String(Math.floor(y)))
            .textField('Z轴', '', String(Math.floor(z)))
            .dropdown(
                '维度',
                LocationTeleportMenu.DimensionList,
                this.getPlayerDimension(player)
            )
            .show(player)
            .then(({ formValues }: ModalFormResponse): void => {
                if (formValues) {
                    try {
                        const [x, y, z]: number[] = [
                            Number(formValues[0]),
                            Number(formValues[1]),
                            Number(formValues[2]),
                        ];
                        const dimension: Dimension = this.parseDimension(
                            Number(formValues[3])
                        );
                        const { x: rx, y: ry }: XYRotation = player.rotation;
                        if (!this.check([x, y, z])) {
                            player.teleport(
                                {
                                    x,
                                    y,
                                    z,
                                },
                                dimension,
                                rx,
                                ry
                            );
                        }
                    } catch (error) {}
                }
            });
    }

    private parseDimension(index: number): Dimension {
        let dimension: string;
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

    private getPlayerDimension(player: T): number {
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

    private check(target: number[]): boolean {
        return (
            Array.from(
                new Set(target.map((item: number): boolean => isNaN(item)))
            ).shift() ?? false
        );
    }
}

export default LocationTeleportMenu;

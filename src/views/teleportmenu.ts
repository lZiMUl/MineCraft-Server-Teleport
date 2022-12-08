import { Dimension, Player } from '@minecraft/server';
import {
    ActionFormData,
    ActionFormResponse,
    ModalFormData,
} from '@minecraft/server-ui';

interface PlayerData {
    playerID: string;
    data: LocationData[];
}

interface LocationData {
    displayName?: string;
    dimension?: Dimension;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
}

class TeleportMenu<T extends Player> {
    private static locationData: PlayerData[] = [];
    private displayNameRegExp: RegExp = new RegExp(/(^\s+)|(\s+$)|\s+/g);
    public constructor(player: T) {
        const ui: ActionFormData = new ActionFormData()
            .title('记点传送器')
            .body('请选择传送地点')
            .button('添加新位置');
        this.getPlayerLocation(player, (item: PlayerData): void => {
            if (item.data.length) {
                ui.button('删除位置');
            }
            item.data.forEach((item: LocationData): void => {
                if (item.displayName) {
                    ui.button(item.displayName as string);
                }
            });
        });
        ui.show(player).then(
            ({ selection, canceled }: ActionFormResponse): void => {
                if (!canceled) {
                    switch (selection) {
                        case 0:
                            this.addLocation(player);
                            break;

                        case 1:
                            this.getPlayerLocation(
                                player,
                                (item: PlayerData): void =>
                                    this.deleteLocation(player, item)
                            );
                            break;

                        case undefined:
                            break;

                        default:
                            this.getPlayerLocation(
                                player,
                                (_item: PlayerData, index: number): void => {
                                    const {
                                        dimension,
                                        x,
                                        y,
                                        z,
                                        rx,
                                        ry,
                                    }: LocationData =
                                        TeleportMenu.locationData[index].data[
                                            selection - 2
                                        ];
                                    player.teleport(
                                        {
                                            x,
                                            y,
                                            z,
                                        },
                                        dimension as Dimension,
                                        rx,
                                        ry
                                    );
                                    player.onScreenDisplay.setTitle(
                                        '§a传送成功'
                                    );
                                    player.onScreenDisplay.updateSubtitle(
                                        `§a坐标为: §e[§c${Math.floor(
                                            x
                                        )}§e, §a${Math.floor(
                                            y
                                        )}§e, §b${Math.floor(z)}§e]`
                                    );
                                }
                            );
                    }
                }
            }
        );
    }

    private addLocation(player: T): void {
        new ModalFormData()
            .title('添加新位置')
            .textField('新位置显示名:', '',)
            .show(player)
            .then(async ({ formValues, canceled }): Promise<void> => {
                if (canceled) {
                    new TeleportMenu<T>(player);
                } else if (formValues) {
                    const displayName: string = formValues[0];
                    if (
                        displayName !== '' &&
                        !this.displayNameRegExp.test(displayName)
                    ) {
                        const [{ x, y, z, rx, ry }, dimension]: [
                            LocationData,
                            Dimension
                        ] = [
                            Object.assign(player.location, {
                                rx: player.rotation.x,
                                ry: player.rotation.y,
                            }),
                            player.dimension,
                        ];
                        this.getPlayerLocation(
                            player,
                            async (rawItem: PlayerData): Promise<void> => {
                                for (let item of rawItem.data) {
                                    if (item.displayName === displayName) {
                                        if (
                                            await this.dangerousOperations(
                                                player,
                                                '该名称已存在是否替换为新位置'
                                            )
                                        ) {
                                            item.dimension = dimension;
                                            item.x = x;
                                            item.y = y;
                                            item.z = z;
                                            item.rx = rx;
                                            item.ry = ry;
                                        }
                                        return;
                                    }
                                }
                                rawItem.data.push({
                                    displayName,
                                    dimension,
                                    x,
                                    y,
                                    z,
                                    rx,
                                    ry,
                                });
                            },
                            (player: T): void => {
                                TeleportMenu.locationData.push({
                                    playerID: player.id,
                                    data: [
                                        {
                                            displayName,
                                            dimension,
                                            x,
                                            y,
                                            z,
                                            rx,
                                            ry,
                                        },
                                    ],
                                });
                            }
                        );
                    } else {
                        player.onScreenDisplay.setTitle('§c错误');
                        player.onScreenDisplay.updateSubtitle(
                            '§c显示名称不合法!\n§c不能为空或者不能有空格'
                        );
                    }
                }
            });
    }

    private getPlayerLocation(
        player: T,
        callback: (item: PlayerData, index: number) => void,
        init?: (player: T) => void
    ) {
        for (let [index, item] of TeleportMenu.locationData.entries()) {
            if (item.playerID === player.id) {
                callback(item, index);
                break;
            }
        }
        init ? init(player) : null;
    }

    private dangerousOperations(player: T, message: string): Promise<boolean> {
        return new Promise((callback: (status: boolean) => void) => {
            new ActionFormData()
                .title('警告')
                .body(message)
                .button('确认')
                .show(player)
                .then(({ selection, canceled }: ActionFormResponse): void => {
                    selection === 0 || !canceled
                        ? callback(true)
                        : callback(false);
                });
        });
    }

    private deleteLocation(player: T, source: PlayerData): void {
        const ui: ActionFormData = new ActionFormData()
            .title('位置删除')
            .body('请选择删除位置');
        source.data.forEach((item: LocationData) => {
            ui.button(item.displayName as string);
        });
        ui.show(player).then(
            async ({
                selection,
                canceled,
            }: ActionFormResponse): Promise<void> => {
                if (
                    !canceled &&
                    (await this.dangerousOperations(player, '是否删除该位置'))
                ) {
                    source.data.forEach(
                        (
                            _item: LocationData,
                            index: number,
                            source: LocationData[]
                        ): void => {
                            if (selection === index) {
                                source.splice(selection, 1);
                            }
                        }
                    );
                } else new TeleportMenu<T>(player);
            }
        );
    }
}

export default TeleportMenu;

export type { PlayerData, LocationData };

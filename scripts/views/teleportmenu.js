import { ActionFormData, ModalFormData, } from '@minecraft/server-ui';
class TeleportMenu {
    static locationData = [];
    displayNameRegExp = new RegExp(/(^\s+)|(\s+$)|\s+/g);
    constructor(player) {
        const ui = new ActionFormData()
            .title('记点传送器')
            .body('请选择传送地点')
            .button('添加新位置');
        this.getPlayerLocation(player, (item) => {
            if (item.data.length) {
                ui.button('删除位置');
            }
            item.data.forEach((item) => {
                if (item.displayName) {
                    ui.button(item.displayName);
                }
            });
        });
        ui.show(player).then(({ selection, canceled }) => {
            if (!canceled) {
                switch (selection) {
                    case 0:
                        this.addLocation(player);
                        break;
                    case 1:
                        this.getPlayerLocation(player, (item) => this.deleteLocation(player, item));
                        break;
                    case undefined:
                        break;
                    default:
                        this.getPlayerLocation(player, (_item, index) => {
                            const { dimension, x, y, z, rx, ry, } = TeleportMenu.locationData[index].data[selection - 2];
                            player.teleport({
                                x,
                                y,
                                z,
                            }, dimension, rx, ry);
                            player.playSound('random.explode', {
                                location: player.location,
                                pitch: 1,
                                volume: 0.5,
                            });
                            player.onScreenDisplay.setTitle('§a传送成功');
                            player.onScreenDisplay.updateSubtitle(`§a坐标为: §e[§c${Math.floor(x)}§e, §a${Math.floor(y)}§e, §b${Math.floor(z)}§e]`);
                        });
                }
            }
        });
    }
    addLocation(player) {
        new ModalFormData()
            .title('添加新位置')
            .textField('新位置显示名:', '')
            .show(player)
            .then(async ({ formValues, canceled }) => {
            if (canceled) {
                new TeleportMenu(player);
            }
            else if (formValues) {
                const displayName = formValues[0];
                if (displayName !== '' &&
                    !this.displayNameRegExp.test(displayName)) {
                    const [{ x, y, z, rx, ry }, dimension] = [
                        Object.assign(player.location, {
                            rx: player.rotation.x,
                            ry: player.rotation.y,
                        }),
                        player.dimension,
                    ];
                    this.getPlayerLocation(player, async (rawItem) => {
                        for (let item of rawItem.data) {
                            if (item.displayName === displayName) {
                                if (await this.dangerousOperations(player, '该名称已存在是否替换为新位置')) {
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
                    }, (player) => {
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
                    });
                }
                else {
                    player.onScreenDisplay.setTitle('§c错误');
                    player.onScreenDisplay.updateSubtitle('§c显示名称不合法!\n§c不能为空或者不能有空格');
                }
            }
        });
    }
    getPlayerLocation(player, callback, init) {
        for (let [index, item] of TeleportMenu.locationData.entries()) {
            if (item.playerID === player.id) {
                callback(item, index);
                break;
            }
        }
        init ? init(player) : null;
    }
    dangerousOperations(player, message) {
        return new Promise((callback) => {
            new ActionFormData()
                .title('警告')
                .body(message)
                .button('确认')
                .show(player)
                .then(({ selection, canceled }) => {
                selection === 0 || !canceled
                    ? callback(true)
                    : callback(false);
            });
        });
    }
    deleteLocation(player, source) {
        const ui = new ActionFormData()
            .title('位置删除')
            .body('请选择删除位置');
        source.data.forEach((item) => {
            ui.button(item.displayName);
        });
        ui.show(player).then(async ({ selection, canceled, }) => {
            if (!canceled &&
                (await this.dangerousOperations(player, '是否删除该位置'))) {
                source.data.forEach((_item, index, source) => {
                    if (selection === index) {
                        source.splice(selection, 1);
                    }
                });
            }
            else
                new TeleportMenu(player);
        });
    }
}
export default TeleportMenu;

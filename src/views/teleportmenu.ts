// 导入基础模块
import { Dimension, Player } from '@minecraft/server';
import {
    ActionFormData,
    ActionFormResponse,
    ModalFormData,
    ModalFormResponse,
} from '@minecraft/server-ui';
// 定义玩家数据格式接口
interface PlayerData {
    playerID: string;
    data: LocationData[];
}
// 定义玩家位置数据格式接口
interface LocationData {
    displayName?: string;
    dimension?: Dimension;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
}
// 创建记点传送器菜单类
class TeleportMenu<T extends Player> {
    // 存储所有玩家位置数据数组
    private static locationData: PlayerData[] = [];
    // 创建正则表达式匹配是否有空格
    private displayNameRegExp: RegExp = new RegExp(
        /^(([A-Za-z0-9\_\u4e00-\u9fa5-]+(\s?))*[A-Za-z0-9\_\u4e00-\u9fa5-]+)$/
    );
    public constructor(player: T) {
        // 创建选择器界面
        const ui: ActionFormData = new ActionFormData()
            .title('记点传送器')
            .body('请选择传送地点')
            .button('添加新位置');
        // 获取玩家位置数据数组
        this.getPlayerLocation(player, (item: PlayerData): void => {
            // 如果有位置数据显示删除按钮
            if (item.data.length) {
                ui.button('删除位置');
            }
            // 遍历位置数据数组
            item.data.forEach((item: LocationData): void => {
                // 判断位置显示名称是否为未定义
                if (item.displayName) {
                    // 将位置名称创建在选择器上面
                    ui.button(
                        (item.displayName as string).replaceAll('|', ' ')
                    );
                }
            });
        });
        ui.show(player).then(
            ({ canceled, selection }: ActionFormResponse): void => {
                // 判断玩家是否取消操作
                if (!canceled) {
                    // 判断玩家选择的功能
                    switch (selection) {
                        // 添加新位置
                        case 0:
                            this.addLocation(player);
                            break;
                        // 删除指定位置
                        case 1:
                            this.getPlayerLocation(
                                player,
                                (item: PlayerData): void =>
                                    this.deleteLocation(player, item)
                            );
                            break;
                        // 传送该位置
                        default:
                            this.getPlayerLocation(
                                player,
                                (_item: PlayerData, index: number): void => {
                                    // 获取位置的数据
                                    const {
                                        displayName,
                                        dimension,
                                        x,
                                        y,
                                        z,
                                        rx,
                                        ry,
                                    }: LocationData =
                                        TeleportMenu.locationData[index].data[
                                            (selection as number) - 2
                                        ];
                                    // 将玩家传送到该位置
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
                                    // 创建并显示主标题
                                    player.onScreenDisplay.setTitle(
                                        `§6${displayName?.replaceAll('|', ' ')}`
                                    );
                                    // 创建并显示副标题
                                    player.onScreenDisplay.updateSubtitle(
                                        `§a维度为: §e[§9${this.getDimensionName(
                                            dimension as Dimension
                                        )}§e] §d| §a坐标为: §e[§c${Math.floor(
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
    // 创建添加新位置方法
    private addLocation(player: T): void {
        // 创建选择器界面
        new ModalFormData()
            .title('添加新位置')
            .textField('新位置显示名:', '')
            .show(player)
            .then(
                async ({
                    canceled,
                    formValues,
                }: ModalFormResponse): Promise<void> => {
                    // 判断玩家是否取消操作
                    if (canceled) {
                        // 如果取消了, 重新打开记点传送菜单
                        new TeleportMenu<T>(player);
                    } else if (formValues) {
                        // 如果没有取消, 获取玩家输入的新位置名称
                        let displayName: string = formValues[0];
                        // 判断新位置名称是否为空字符串并且正则表达式匹配是否包含空格
                        if (
                            displayName !== '' &&
                            this.displayNameRegExp.test(displayName)
                        ) {
                            // 修改位置显示名称内容格式 显示不影响
                            displayName = displayName.replaceAll(' ', '|');
                            // 获取玩家当前位置数据
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
                            // 匹配新位置名称和旧位置名称是否一样，如果一样是否替换旧位置
                            this.getPlayerLocation(
                                player,
                                async (
                                    rawItem: PlayerData
                                ): Promise<boolean> => {
                                    // 获取所有位置
                                    for (let item of rawItem.data) {
                                        // 判断新名称是否在位置数据数组中存在
                                        if (item.displayName === displayName) {
                                            // 判断玩家是否选择替换操作
                                            if (
                                                await this.dangerousOperations(
                                                    player,
                                                    '该名称已存在是否替换为新位置'
                                                )
                                            ) {
                                                // 替换旧数据操作
                                                item.dimension = dimension;
                                                item.x = x;
                                                item.y = y;
                                                item.z = z;
                                                item.rx = rx;
                                                item.ry = ry;
                                                return true;
                                            }
                                            return false;
                                        }
                                    }
                                    // 将新位置推进位置数据数组中
                                    rawItem.data.push({
                                        displayName,
                                        dimension,
                                        x,
                                        y,
                                        z,
                                        rx,
                                        ry,
                                    });
                                    return true;
                                },
                                (player: T): void => {
                                    // 如果没有任何位玩家数据直接初始化一个玩家数据
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
                            // 如果包含空格显示错误并创建并显示主标题
                            player.onScreenDisplay.setTitle('§c错误');
                            // 创建并显示副标题
                            player.onScreenDisplay.updateSubtitle(
                                '§c显示名称不合法!\n§c不能为空或者开头不能有空格'
                            );
                        }
                    }
                }
            );
    }
    // 创建获取玩家维度方法
    private getDimensionName({ id }: Dimension): string {
        // 获取指定玩家的维度标识符
        switch (id) {
            // 主世界
            case 'minecraft:overworld':
                return '主世界';
            // 地狱
            case 'minecraft:nether':
                return '地狱';
            // 末地
            case 'minecraft:the_end':
                return '末地';
            // 主世界
            default:
                return '主世界';
        }
    }
    // 创建获取指定玩家的位置数据数组方法
    private getPlayerLocation(
        player: T,
        callback: (item: PlayerData, index: number) => void,
        init?: (player: T) => void
    ): void {
        // 循环玩家数据数组
        for (let [index, item] of TeleportMenu.locationData.entries()) {
            // 判断当前玩家名字是否与目标玩家名字一致
            if (item.playerID === player.id) {
                // 返回目标玩家数据和索引
                callback(item, index);
                // 推出后续循环
                break;
            }
        }
        // 如果有初始化方法直接调用初始化方法否则不执行
        init ? init(player) : null;
    }
    // 创建危险操作界面方法
    private dangerousOperations(player: T, message: string): Promise<boolean> {
        // 返回异步操作
        return new Promise((callback: (status: boolean) => void) => {
            // 创建选择器界面
            new ActionFormData()
                .title('警告')
                .body(message)
                .button('确认')
                .show(player)
                .then(({ canceled, selection }: ActionFormResponse): void => {
                    // 判断选择操作
                    selection === 0 || !canceled
                        ? callback(true)
                        : callback(false);
                });
        });
    }
    // 创建删除指定位置方法
    private deleteLocation(player: T, source: PlayerData): void {
        // 创建选择器界面
        const ui: ActionFormData = new ActionFormData()
            .title('位置删除')
            .body('请选择删除位置');
        // 遍历目标玩家位置数据数组
        source.data.forEach((item: LocationData) => {
            // 将位置名称创建在选择器上面
            ui.button((item.displayName as string).replaceAll('|', ' '));
        });
        ui.show(player).then(
            async ({
                canceled,
                selection,
            }: ActionFormResponse): Promise<void> => {
                // 判断玩家是否取消操作并且使用删除功能选择
                if (
                    !canceled &&
                    (await this.dangerousOperations(player, '是否删除该位置'))
                ) {
                    // 遍历指定玩家的位置数据数组
                    source.data.forEach(
                        (
                            _item: LocationData,
                            index: number,
                            source: LocationData[]
                        ): void => {
                            // 判断选择索引和遍历索引是否一致
                            if (selection === index) {
                                // 删除位置
                                source.splice(selection, 1);
                            }
                        }
                    );
                }
                // 否则重新打开记点传送菜单
                else new TeleportMenu<T>(player);
            }
        );
    }
}
// 导出记点传送菜单
export default TeleportMenu;
// 导出记点传送菜单数据格式接口
export type { PlayerData, LocationData };

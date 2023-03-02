// 导入基础模块
import { Dimension, Player, XYRotation } from '@minecraft/server';
import {
    ActionFormData,
    ActionFormResponse,
    ModalFormData,
    ModalFormResponse,
} from '@minecraft/server-ui';
import DataSaver, { LocationData } from 'src/tool/dataSaver';

// 创建位置传送器菜单类
class LocationTeleporterMenu<T extends Player> {
    // 存储所有玩家位置数据数组
    private dataSaver: DataSaver<Player>;
    // 创建正则表达式匹配是否有空格
    private displayNameRegExp: RegExp = new RegExp(
        /^(([A-Za-z0-9\_\u4e00-\u9fa5-]+(\s?))*[A-Za-z0-9\_\u4e00-\u9fa5-]+)$/
    );
    public constructor(player: T) {
        this.dataSaver = new DataSaver<Player>(player);
        // 创建选择器界面
        const ui: ActionFormData = new ActionFormData()
            .title('Location Teleporter')
            .body('Please select a delivery location')
            .button('Add a new location');
        // 获取玩家位置数据数组
        this.dataSaver.getData?.forEach(
            (item: LocationData, index: number): void => {
                if (!index) {
                    ui.button('Delete a location');
                }
                // 判断位置显示名称是否为未定义
                if (item.displayName) {
                    // 将位置名称创建在选择器上面
                    ui.button(
                        (item.displayName as string).replaceAll('|', ' ')
                    );
                }
            }
        );
        // 获取玩家位置数据数组
        // this.getPlayerLocation(player, (item: PlayerData): void => {
        //     // 如果有位置数据显示删除按钮
        //     if (item.data.length) {
        //         ui.button('Delete a location');
        //     }
        //     // 遍历位置数据数组
        //     item.data.forEach((item: LocationData): void => {
        //         // 判断位置显示名称是否为未定义
        //         if (item.displayName) {
        //             // 将位置名称创建在选择器上面
        //             ui.button(
        //                 (item.displayName as string).replaceAll('|', ' ')
        //             );
        //         }
        //     });
        // });
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
                            this.deleteLocation(player);

                            break;
                        // 传送到该位置
                        default:
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
                                this.dataSaver.getData[
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
                                ry,
                                false
                            );
                            // 创建并显示主标题
                            player.onScreenDisplay.setTitle(
                                `§6${displayName?.replaceAll('|', ' ')}`
                            );
                            // 创建并显示副标题
                            player.onScreenDisplay.updateSubtitle(
                                `§aThe dimension is: §e[§9${this.getDimensionName(
                                    dimension as Dimension
                                )}§e] §d| §aThe coordinates are: §e[§c${Math.floor(
                                    x
                                )}§e, §a${Math.floor(y)}§e, §b${Math.floor(
                                    z
                                )}§e]`
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
            .title('Add a new location')
            .textField('The new location display name:', '')
            .show(player)
            .then(
                async ({
                    canceled,
                    formValues,
                }: ModalFormResponse): Promise<void> => {
                    // 判断玩家是否取消操作
                    if (canceled) {
                        // 如果取消了, 重新打开位置传送器菜单
                        new LocationTeleporterMenu<T>(player);
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
                            // 获取目标玩家的视角坐标系
                            const rotation: XYRotation = player.rotation;
                            // 获取玩家当前位置数据
                            const [{ x, y, z, rx, ry }, dimension]: [
                                LocationData,
                                Dimension
                            ] = [
                                Object.assign(player.location, {
                                    rx: rotation.x,
                                    ry: rotation.y,
                                }),
                                player.dimension,
                            ];
                            if (this.dataSaver.hasData(displayName)) {
                                if (
                                    await this.dangerousOperations(
                                        player,
                                        'Whether the name already exists is replaced with the new location'
                                    )
                                ) {
                                    this.dataSaver.editData({
                                        displayName,
                                        dimension,
                                        x,
                                        y,
                                        z,
                                        rx,
                                        ry,
                                    });
                                }
                            } else {
                                this.dataSaver.addData({
                                    displayName,
                                    dimension,
                                    x,
                                    y,
                                    z,
                                    rx,
                                    ry,
                                });
                            }

                            // 匹配新位置名称和旧位置名称是否一样，如果一样是否替换旧位置
                            // this.getPlayerLocation(
                            //     player,
                            //     async (
                            //         rawItem: PlayerData
                            //     ): Promise<boolean> => {
                            //         // 获取所有位置
                            //         for (let item of rawItem.data) {
                            //             // 判断新名称是否在位置数据数组中存在
                            //             if (item.displayName === displayName) {
                            //                 // 判断玩家是否选择替换操作
                            //                 if (
                            //                     await this.dangerousOperations(
                            //                         player,
                            //                         'Whether the name already exists is replaced with the new location'
                            //                     )
                            //                 ) {
                            //                     // 替换旧数据操作
                            //                     item.dimension = dimension;
                            //                     item.x = x;
                            //                     item.y = y;
                            //                     item.z = z;
                            //                     item.rx = rx;
                            //                     item.ry = ry;
                            //                     return true;
                            //                 }
                            //                 return false;
                            //             }
                            //         }
                            //         // 将新位置推进位置数据数组中
                            //         rawItem.data.push({
                            //             displayName,
                            //             dimension,
                            //             x,
                            //             y,
                            //             z,
                            //             rx,
                            //             ry,
                            //         });
                            //         return true;
                            //     },
                            //     (player: T): void => {
                            //         // 如果没有任何位玩家数据直接初始化一个玩家数据
                            //         LocationTeleporterMenu.locationData.push({
                            //             playerID: player.id,
                            //             data: [
                            //                 {
                            //                     displayName,
                            //                     dimension,
                            //                     x,
                            //                     y,
                            //                     z,
                            //                     rx,
                            //                     ry,
                            //                 },
                            //             ],
                            //         });
                            //     }
                            // );
                        } else {
                            // 如果包含空格显示错误并创建并显示主标题
                            player.onScreenDisplay.setTitle('§cmistake');
                            // 创建并显示副标题
                            player.onScreenDisplay.updateSubtitle(
                                '§cThe display name is invalid!\n§cCannot be empty or have a space at the beginning'
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
                return 'Overworld';
            // 地狱
            case 'minecraft:nether':
                return 'Hell';
            // 末地
            case 'minecraft:the_end':
                return 'The end';
            // 主世界
            default:
                return 'Overworld';
        }
    }
    // 创建危险操作界面方法
    private dangerousOperations(player: T, message: string): Promise<boolean> {
        // 返回异步操作
        return new Promise((callback: (status: boolean) => void) => {
            // 创建选择器界面
            new ActionFormData()
                .title('Warn')
                .body(message)
                .button('confirm')
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
    private deleteLocation(player: T): void {
        // 创建选择器界面
        const ui: ActionFormData = new ActionFormData()
            .title('Location deletion')
            .body('Please select Delete Location');
        // 遍历目标玩家位置数据数组
        this.dataSaver.getData.forEach((item: LocationData) => {
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
                    (await this.dangerousOperations(
                        player,
                        'Whether to delete the location'
                    ))
                ) {
                    const result: string | undefined =
                        this.dataSaver.getData[selection as number].displayName;
                    if (result) {
                        this.dataSaver.deleteData(result);
                    }
                }
                // 否则重新打开位置传送器菜单
                else new LocationTeleporterMenu<T>(player);
            }
        );
    }
}
// 导出位置传送器菜单
export default LocationTeleporterMenu;
// 导出位置传送器菜单数据格式接口
export type { LocationData };

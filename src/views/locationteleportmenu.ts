// 导入基础模块
import {
    Dimension,
    Player,
    Vector3,
    world,
    XYRotation,
} from '@minecraft/server';
import { ModalFormData, ModalFormResponse } from '@minecraft/server-ui';
// 创建坐标传送器菜单类
class LocationTeleportMenu<T extends Player> {
    // 创建静态维度名称
    private static DimensionList: string[] = ['主世界', '地狱', '末地'];
    public constructor(player: T) {
        // 获取玩家位置
        const { x, y, z }: Vector3 = player.location;
        // 创建选择器界面
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
            .then(({ canceled, formValues }: ModalFormResponse): void => {
                // 判断玩家是否取消操作并且值是否为空或者未定义
                if (!canceled && formValues) {
                    try {
                        // 判断三维坐标是否为数字
                        if (this.check(formValues)) {
                            // 获取玩家输入的三维坐标值
                            const [x, y, z]: number[] = [
                                Number(formValues[0]),
                                Number(formValues[1]),
                                Number(formValues[2]),
                            ];
                            // 获取玩家选择的维度
                            const dimension: Dimension = this.parseDimension(
                                Number(formValues[3])
                            );
                            // 获取玩家的视角坐标
                            const { x: rx, y: ry }: XYRotation =
                                player.rotation;
                            // 将玩家传送到该位置
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
                        } else {
                            // 创建并显示主标题
                            player.onScreenDisplay.setTitle('§4非法三维坐标值');
                        }
                    } catch (error) {}
                }
            });
    }
    // 创建解析维度方法
    private parseDimension(index: number): Dimension {
        // 定义维度暂存字符串
        let dimension: string;
        // 获取玩家选择的维度索引
        switch (index) {
            // 主世界
            case 0:
                dimension = 'minecraft:overworld';
                break;
            // 地狱
            case 1:
                dimension = 'minecraft:nether';
                break;
            // 末地
            case 2:
                dimension = 'minecraft:the_end';
                break;
            // 主世界
            default:
                dimension = 'minecraft:overworld';
        }
        // 返回维度数据
        return world.getDimension(dimension);
    }
    // 创建获取玩家维度方法
    private getPlayerDimension(player: T): number {
        // 获取指定玩家的维度标识符
        switch (player.dimension.id) {
            // 主世界
            case 'minecraft:overworld':
                return 0;
            // 地狱
            case 'minecraft:nether':
                return 1;
            // 末地
            case 'minecraft:the_end':
                return 2;
            // 主世界
            default:
                return 0;
        }
    }
    // 检测数组内容是否全部是数字类型
    private check(target: unknown[]): boolean {
        for (let item of target) {
            if (item === '' || isNaN(Number(item))) {
                return false;
            }
        }
        return true;
    }
}
// 导出坐标传送器菜单
export default LocationTeleportMenu;

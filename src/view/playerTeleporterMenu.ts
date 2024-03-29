// 导入基础模块
import { Player, world, XYRotation } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
// 定义玩家传送器菜单类
class PlayerTeleporterMenu<T extends Player> {
    // 存储所有玩家名字和位置的数据数组
    private players: T[] = [];
    public constructor(player: T) {
        // 获取所有玩家实体
        for (let player of world.getPlayers()) {
            // 把玩家推进玩家数据数组中
            this.players.push(player as T);
        }
        // 创建选择器界面
        const ui: ActionFormData = new ActionFormData()
            .title('Player Teleporter')
            .body('Please select the player to teleport');
        // 遍历玩家数据数组
        this.players.forEach(({ name }: T): void => {
            // 将玩家名字创建在选择器上面
            ui.button(name);
        });
        ui.show(player).then(
            ({ canceled, selection }: ActionFormResponse): void => {
                // 判断玩家是否取消操作
                if (!canceled) {
                    // 获取玩家选择的目标玩家
                    const targetPlayer: T = this.players[selection as number];
                    // 获取目标玩家的位置和维度
                    const { location, dimension }: T = targetPlayer;
                    // 获取目标玩家的视角坐标系
                    const { x: rx, y: ry }: XYRotation = targetPlayer.rotation;
                    // 将操作玩家传送至目标玩家
                    player.teleport(location, dimension, rx, ry, false);
                    // 调用显示提示
                    this.tipsUI(player, targetPlayer);
                }
            }
        );
    }
    // 提示方法
    private tipsUI(sourcePlayer: T, targetPlayer: T): void {
        // 创建并显示主标题
        targetPlayer.onScreenDisplay.setActionBar(
            `§aPlayer §e[§c${sourcePlayer.name}§e] §ahas teleported to you`
        );
    }
}
// 导出玩家传送器菜单
export default PlayerTeleporterMenu;

// 导入基础模块
import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
// 导入所需要的界面模块
import PlayerTeleporterMenu from './view/playerTeleporterMenu';
import LocationTeleporterMenu from './view/locationTeleporterMenu';
import CoordinateTeleporterMenu from './view/coordinateTeleporterMenu';
// 定义菜单类
class Menu<T extends Player> {
    public constructor(player: T) {
        // 创建选择器界面
        new ActionFormData()
            .title('Actions menu')
            .body('Please select an action (v1.4.1 by lZiMUl)')
            .button('Player Teleporter')
            .button('Location Teleporter')
            .button('Coordinate Teleporter')
            .show(player)
            .then(({ canceled, selection }: ActionFormResponse): void => {
                // 判断玩家是否取消操作
                if (!canceled) {
                    // 判断玩家选择的功能
                    switch (selection) {
                        // 玩家传送器菜单
                        case 0:
                            new PlayerTeleporterMenu<T>(player);
                            break;
                        // 位置传送器菜单
                        case 1:
                            new LocationTeleporterMenu<T>(player);
                            break;
                        // 坐标传送器菜单
                        case 2:
                            new CoordinateTeleporterMenu<T>(player);
                            break;
                    }
                }
            });
    }
}
// 导出菜单模块
export default Menu;

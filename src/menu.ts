// 导入基础模块
import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';
// 导入所需要的界面模块
import TpaMenu from './views/tpamenu';
import TeleportMenu from './views/teleportmenu';
import LocationTeleportMenu from './views/locationteleportmenu';
// 定义菜单类
class Menu<T extends Player> {
    public constructor(player: T) {
        // 创建选择器界面
        new ActionFormData()
            .title('操作面板')
            .body('请选择操作 (v1.2.5 by lZiMUl)')
            .button('玩家传送器')
            .button('记点传送器')
            .button('坐标传送器')
            .show(player)
            .then(({ canceled, selection }: ActionFormResponse): void => {
                // 判断玩家是否取消操作
                if (!canceled) {
                    // 判断玩家选择的功能
                    switch (selection) {
                        // 玩家传送器菜单
                        case 0:
                            new TpaMenu<T>(player);
                            break;
                        // 记点传送器菜单
                        case 1:
                            new TeleportMenu<T>(player);
                            break;
                        // 坐标传送器菜单
                        case 2:
                            new LocationTeleportMenu<T>(player);
                    }
                }
            });
    }
}
// 导出菜单模块
export default Menu;

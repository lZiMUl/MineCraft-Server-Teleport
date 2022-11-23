import { Player } from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

import TpaMenu from './views/tpamenu';
import TeleportMenu from './views/teleportmenu';
import LocationTeleportMenu from './views/locationteleportmenu';

class Menu<T extends Player> {
    public constructor(player: T) {
        new ActionFormData()
            .title('操作面板')
            .body('请选择操作 (v1.0.0 by lZiMUl)')
            .button('玩家传送器')
            .button('记点传送器')
            .button('坐标传送器')
            .show(player)
            .then(({ selection, canceled }: ActionFormResponse): void => {
                if (!canceled) {
                    switch (selection) {
                        case 0:
                            new TpaMenu<T>(player);
                            break;

                        case 1:
                            new TeleportMenu<T>(player);
                            break;

                        case 2:
                            new LocationTeleportMenu<T>(player);
                    }
                }
            });
    }
}

export default Menu;

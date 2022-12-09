// 导入基础模块
import { world, ItemUseEvent, Player } from '@minecraft/server';
import Menu from './menu';
// 监听物品使用事件
world.events.itemUse.subscribe(({ item, source }: ItemUseEvent): void => {
    // 判断物品类型标识符
    switch (item.typeId) {
        // 如果物品类型标识符是指南针就执行以下代码块
        case 'minecraft:compass':
            // 打开菜单面板
            new Menu<Player>(source as Player);
            break;
    }
});

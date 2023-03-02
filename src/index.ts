// 导入基础模块
import {
    world,
    Player,
    ItemUseEvent,
    ChatEvent,
    PlayerJoinEvent,
} from '@minecraft/server';
import Menu from './menu';
import CommandRegister from './tool/commandRegister';
// 监听物品使用事件
world.events.itemUse.subscribe(({ item, source }: ItemUseEvent): void => {
    // 判断是否为潜伏状态
    if (source.isSneaking) {
        // 判断物品类型标识符
        switch (item.typeId) {
            // 如果物品类型标识符是指南针就执行以下代码块
            case 'minecraft:compass':
                // 播放音效
                // 打开菜单面板
                new Menu<Player>(source as Player);
                world.playSound('note.banjo', {
                    location: source.headLocation,
                    pitch: 1,
                    volume: 1,
                });
                break;
        }
    }
});
// 创建自定义命令类
const commandRegister: CommandRegister = new CommandRegister('#');
// 获取版本
commandRegister.addCommandListener('version', (): void => {
    world.say('Version: 1.4.1');
});
// 将聊天数据流发送到自定义命令管道里
world.events.chat.subscribe(({ message, sender }: ChatEvent): void =>
    commandRegister.chatStream(message, sender)
);
// 玩家进入世界提示
world.events.playerJoin.subscribe(({ playerId }: PlayerJoinEvent): void => {
    for (let player of world.getAllPlayers()) {
        if (playerId === player.id) {
            player.onScreenDisplay.setTitle('§eTips');
            player.onScreenDisplay.updateSubtitle(
                '§aThe world has §cMST §aservices enabled'
            );
            break;
        }
    }
});

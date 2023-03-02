import { Player } from '@minecraft/server';
interface Data {
    sender: Player;
    args: string[];
}
interface CallBack {
    (data: Data): void;
}
interface Cache {
    commandName: string;
    callback: CallBack;
}
declare class CommandRegister {
    private identifier;
    private cache;
    constructor(identifier: string);
    addCommandListener(commandName: string, callback: CallBack): void;
    chatStream(message: string, sender: Player): void;
}
export default CommandRegister;
export type { Data, CallBack, Cache };
//# sourceMappingURL=commandRegister.d.ts.map
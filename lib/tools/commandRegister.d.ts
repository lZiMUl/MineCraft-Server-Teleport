import EventEmitter from './eventEmitter';
declare type CallBack = (args: string[]) => void;
declare class CommandRegisterIdentifier extends EventEmitter {
    private identifier;
    private eventList;
    private static regexp;
    constructor(identifier?: string);
    register(command: string): void;
    addListener(eventName: string, callback: CallBack): void;
    stream(data: string): void;
}
declare class CommandRegister {
    private static core;
    static setCore(core: CommandRegisterIdentifier): void;
    constructor(command: string, callback: CallBack);
}
export default CommandRegister;
export { CommandRegisterIdentifier };
export type { CallBack };
//# sourceMappingURL=commandRegister.d.ts.map
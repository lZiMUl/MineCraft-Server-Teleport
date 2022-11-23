import { World } from '@minecraft/server';
declare class Logger<T extends World> {
    private context;
    constructor(context: T);
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    private get getTime();
    private outMsg;
}
export default Logger;
//# sourceMappingURL=logger.d.ts.map
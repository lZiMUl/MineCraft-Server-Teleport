interface EventConfig {
    eventName: string;
    callback: (args: string[]) => void;
}
declare class EventEmitter {
    private cache;
    addListener(eventName: string, callback: any): void;
    emit(eventName: string | undefined, args: string[]): void;
}
export default EventEmitter;
export type { EventConfig };
//# sourceMappingURL=eventEmitter.d.ts.map
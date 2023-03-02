import { Dimension, Player } from '@minecraft/server';
interface LocationData {
    displayName?: string;
    dimension?: Dimension;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
}
declare class DataSaver<T extends Player> {
    private player;
    constructor(player: T);
    private isMST;
    hasData(displayName: string): boolean;
    get getData(): LocationData[];
    editData(data: LocationData): void;
    addData(data: LocationData): boolean;
    deleteData(displayName: string): void;
}
export default DataSaver;
export type { LocationData };
//# sourceMappingURL=dataSaver.d.ts.map
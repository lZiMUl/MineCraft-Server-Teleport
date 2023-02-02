import { Dimension, Player } from '@minecraft/server';
interface PlayerData {
    playerID: string;
    data: LocationData[];
}
interface LocationData {
    displayName?: string;
    dimension?: Dimension;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
}
declare class TeleportPointMenu<T extends Player> {
    private static locationData;
    private displayNameRegExp;
    constructor(player: T);
    private addLocation;
    private getDimensionName;
    private getPlayerLocation;
    private dangerousOperations;
    private deleteLocation;
}
export default TeleportPointMenu;
export type { PlayerData, LocationData };
//# sourceMappingURL=teleport_point_menu.d.ts.map
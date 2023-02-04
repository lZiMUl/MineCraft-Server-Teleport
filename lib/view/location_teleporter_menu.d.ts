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
declare class LocationTeleporterMenu<T extends Player> {
    private static locationData;
    private displayNameRegExp;
    constructor(player: T);
    private addLocation;
    private getDimensionName;
    private getPlayerLocation;
    private dangerousOperations;
    private deleteLocation;
}
export default LocationTeleporterMenu;
export type { PlayerData, LocationData };
//# sourceMappingURL=location_teleporter_menu.d.ts.map
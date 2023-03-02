import { Player } from '@minecraft/server';
import { LocationData } from 'src/tool/dataSaver';
declare class LocationTeleporterMenu<T extends Player> {
    private dataSaver;
    private displayNameRegExp;
    constructor(player: T);
    private addLocation;
    private getDimensionName;
    private dangerousOperations;
    private deleteLocation;
}
export default LocationTeleporterMenu;
export type { LocationData };
//# sourceMappingURL=locationTeleporterMenu.d.ts.map
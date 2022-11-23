import { Player } from '@minecraft/server';
import Logger from 'src/tools/logger';
import UsersInfo from '../usersinfo';
interface Config {
    logger: Logger;
    player: Player;
}
interface Location {
    x: number;
    y: number;
    z: number;
}
declare class Menu extends UsersInfo {
    constructor({ logger, player }: Config);
}
export default Menu;
export type { Location, Config };
//# sourceMappingURL=menu.d.ts.map
import { World, Player } from "@minecraft/server";
declare class SneakingEvent {
    private static Players;
    constructor(world: World);
    addPlayer(playerEntity: Player): void;
    deletePlayer(playerName: string): void;
}
export default SneakingEvent;
//# sourceMappingURL=sneakingevent.d.ts.map
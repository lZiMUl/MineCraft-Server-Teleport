import {
    Dimension,
    Location,
    Player,
    world,
    XYRotation,
} from '@minecraft/server';
import { ActionFormData, ActionFormResponse } from '@minecraft/server-ui';

interface TargetPlayer {
    location: Location;
    dimension: Dimension;
}

class TpaMenu<T extends Player> {
    private players: T[] = [];
    public constructor(player: T) {
        for (let player of world.getPlayers()) {
            this.players.push(player as T);
        }
        const ui: ActionFormData = new ActionFormData()
            .title('玩家传送器')
            .body('请选择传送玩家');
        this.players.forEach(({ name }: T): void => {
            ui.button(name);
        });
        ui.show(player).then(
            ({ selection, canceled }: ActionFormResponse): void => {
                if (!canceled) {
                    const targetPlayer: T = this.players[selection as number];
                    const { location, dimension }: TargetPlayer = targetPlayer;
                    const { x: rx, y: ry }: XYRotation = targetPlayer.rotation;
                    player.teleport(location, dimension, rx, ry);
                    this.tipsUI(targetPlayer, player);
                }
            }
        );
    }

    private tipsUI(targetPlayer: T, source: T): void {
        targetPlayer.onScreenDisplay.setActionBar(
            `§a玩家 §e[§c${source.name}§e] §a已到您身边`
        );
    }
}

export default TpaMenu;

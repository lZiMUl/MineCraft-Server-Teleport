import { world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
class TpaMenu {
    players = [];
    constructor(player) {
        for (let player of world.getPlayers()) {
            this.players.push(player);
        }
        const ui = new ActionFormData()
            .title('玩家传送器')
            .body('请选择传送玩家');
        this.players.forEach(({ name }) => {
            ui.button(name);
        });
        ui.show(player).then(({ selection }) => {
            if (selection !== undefined) {
                const targetPlayer = this.players[selection];
                const { x, y, z } = targetPlayer.location;
                const { x: rx, y: ry } = targetPlayer.rotation;
                player.teleport({
                    x,
                    y,
                    z,
                }, targetPlayer.dimension, rx, ry);
                this.tipsUI(targetPlayer, player);
            }
        });
    }
    tipsUI(targetPlayer, source) {
        targetPlayer.onScreenDisplay.setActionBar(`§a玩家 §e[§c${source.name}§e] §a已到您身边`);
    }
}
export default TpaMenu;

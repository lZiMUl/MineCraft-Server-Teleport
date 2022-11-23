import { world, ItemUseEvent, Player } from '@minecraft/server';
import Menu from './menu';

world.events.itemUse.subscribe(({ item, source }: ItemUseEvent): void => {
    switch (item.typeId) {
        case 'minecraft:compass':
            new Menu<Player>(source as Player);
            break;
    }
});

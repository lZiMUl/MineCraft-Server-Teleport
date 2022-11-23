import { world } from '@minecraft/server';
import Menu from './menu';
world.events.itemUse.subscribe(({ item, source }) => {
    switch (item.typeId) {
        case 'minecraft:compass':
            new Menu(source);
            break;
    }
});

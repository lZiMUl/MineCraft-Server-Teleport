import { Dimension, Player } from '@minecraft/server';

// 定义玩家位置数据格式接口
interface LocationData {
    displayName?: string;
    dimension?: Dimension;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
}

interface PD {
    type?: string;
    data: LocationData[];
}

class DataSaver<T extends Player> {
    private player: T;
    public constructor(player: T) {
        this.player = player;
    }

    private isMST(data: string): boolean {
        try {
            let { type }: PD = JSON.parse(data) as PD;
            if (type === 'MST') {
                return true;
            }
        } catch (err) {}
        return false;
    }

    public hasData(displayName: string): boolean {
        for (let tag of this.player.getTags()) {
            if (this.isMST(tag)) {
                for (let { displayName: rawDisplayName } of (
                    JSON.parse(tag) as PD
                ).data) {
                    if (rawDisplayName === displayName) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public get getData(): LocationData[] {
        for (let tag of this.player.getTags()) {
            if (this.isMST(tag)) {
                return (JSON.parse(tag) as PD).data;
            }
        }
        return [];
    }

    public editData(data: LocationData): void {
        for (let tag of this.player.getTags()) {
            if (this.isMST(tag)) {
                const source: LocationData[] = (JSON.parse(tag) as PD).data;
                source.forEach((item: LocationData, index: number): void => {
                    if (data.displayName === item.displayName) {
                        const target = source[index];
                        target.dimension = data.dimension;
                        target.x = data.x;
                        target.y = data.y;
                        target.z = data.z;
                        target.rx = data.rx;
                        target.ry = data.ry;
                        this.player.removeTag(tag);
                        this.player.addTag(JSON.stringify(target));
                    }
                });
            }
        }
    }

    public addData(data: LocationData): boolean {
        for (let tag of this.player.getTags()) {
            if (this.isMST(tag)) {
                const { data: rawData }: PD = JSON.parse(tag) as PD;
                rawData.push(data);
                this.player.removeTag(tag);
                return this.player.addTag(JSON.stringify(rawData));
            }
        }
        return false;
    }

    public deleteData(displayName: string): void {
        for (let tag of this.player.getTags()) {
            if (this.isMST(tag)) {
                const source: LocationData[] = (JSON.parse(tag) as PD).data;
                source.forEach((item: LocationData, index: number) => {
                    if (item.displayName === displayName) {
                        source.splice(index, 1);
                    }
                });
            }
        }
    }
}

export default DataSaver;
export type { LocationData };

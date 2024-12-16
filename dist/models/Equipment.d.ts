import type { Model } from '../types/Model';
import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class Equipment implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    included?: any;
    _relationships?: any;
    serial: string;
    model?: EquipmentModel;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Equipment;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}

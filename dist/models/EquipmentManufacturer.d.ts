import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class EquipmentManufacturer implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    name: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): EquipmentManufacturer;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}

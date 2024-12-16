import type { Model } from "../types/Model";
import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class EquipmentModel implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    name: string;
    documentation: EquipmentModelDocumentation[];
    manufacturer?: EquipmentManufacturer;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): EquipmentModel;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
export {};

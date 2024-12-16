import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
type EquipmentModelAttributes = {
    name: string;
    documentation: EquipmentModelDocumentation[];
};
type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
type EquipmentModelRelationships = {
    manufacturer: Relationship;
};
export declare class EquipmentModel implements Model {
    id: string;
    type: string;
    attributes: EquipmentModelAttributes;
    meta: any;
    links: any;
    relationships?: EquipmentModelRelationships;
    included?: any;
    constructor(data?: EquipmentModel);
    static hydrate(data: EquipmentModel): EquipmentModel;
}
export {};

import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
type EquipmentAttributes = {
    serial: string;
};
type EquipmentRelationships = {
    model: Relationship;
};
export declare class Equipment implements Model {
    id: string;
    type: string;
    attributes: EquipmentAttributes;
    meta: any;
    links: any;
    relationships?: EquipmentRelationships;
    included?: any;
    constructor(data?: Equipment);
    static hydrate(data: Equipment): Equipment;
}
export {};

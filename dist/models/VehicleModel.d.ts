import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
type VehicleModelAttributes = {
    name: string;
};
type VehicleModelRelationships = {
    manufacturer: Relationship;
};
export declare class VehicleModel implements Model {
    id: string;
    type: string;
    attributes: VehicleModelAttributes;
    meta: any;
    links: any;
    relationships?: VehicleModelRelationships;
    included?: any;
    constructor(data?: VehicleModel);
    static hydrate(data: VehicleModel): VehicleModel;
}
export {};

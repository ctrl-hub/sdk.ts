import type { Model } from '../types/Model';
import type { Relationship } from 'types/Relationship';
type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
    colour: string;
};
type VehicleRelationships = {
    specification: Relationship;
};
export declare class Vehicle implements Model {
    id: string;
    type: string;
    attributes: VehicleAttributes;
    meta: any;
    links: any;
    relationships?: VehicleRelationships;
    included?: any;
    constructor(data?: Vehicle);
    static hydrate(data: Vehicle): Vehicle;
}
export {};

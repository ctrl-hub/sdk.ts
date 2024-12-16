import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
export declare class Vehicle implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    registration: string;
    vin: string;
    description: string;
    colour: string;
    specification?: VehicleSpecification;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Vehicle;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}

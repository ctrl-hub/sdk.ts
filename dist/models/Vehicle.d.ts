import type { Model } from "../types/Model";
type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
    colour: string;
};
export declare class Vehicle implements Model {
    id: string;
    type: string;
    attributes: VehicleAttributes;
    meta: any;
    links: any;
    relationships?: any;
    constructor();
    static hydrate(data: any): Vehicle;
}
export {};

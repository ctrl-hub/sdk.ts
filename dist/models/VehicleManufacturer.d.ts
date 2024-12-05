import type { Model } from "../types/Model";
type VehicleManufacturerAttributes = {
    name: string;
};
export declare class VehicleManufacturer implements Model {
    id: string;
    type: string;
    attributes: VehicleManufacturerAttributes;
    meta: any;
    links: any;
    relationships?: any;
    constructor();
    static hydrate(data: any): VehicleManufacturer;
}
export {};

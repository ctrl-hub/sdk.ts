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
    included?: any;
    constructor(data?: VehicleManufacturer);
    static hydrate(data: VehicleManufacturer): VehicleManufacturer;
}
export {};

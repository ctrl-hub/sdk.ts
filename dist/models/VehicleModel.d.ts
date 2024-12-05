import type { Model } from "../types/Model";
type VehicleModelAttributes = {
    name: string;
};
export declare class VehicleModel implements Model {
    id: string;
    type: string;
    attributes: VehicleModelAttributes;
    meta: any;
    links: any;
    relationships?: any;
    constructor();
    static hydrate(data: any): VehicleModel;
}
export {};

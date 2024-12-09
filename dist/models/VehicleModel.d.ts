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
    included?: any;
    constructor(data?: VehicleModel);
    static hydrate(data: VehicleModel): VehicleModel;
}
export {};

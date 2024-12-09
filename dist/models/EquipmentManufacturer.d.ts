import type { Model } from "../types/Model";
type EquipmentManufacturerAttributes = {
    name: string;
};
export declare class EquipmentManufacturer implements Model {
    id: string;
    type: string;
    attributes: EquipmentManufacturerAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: EquipmentManufacturer);
    static hydrate(data: EquipmentManufacturer): EquipmentManufacturer;
}
export {};

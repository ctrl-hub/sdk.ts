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
    constructor();
    static hydrate(data: any): EquipmentManufacturer;
}
export {};

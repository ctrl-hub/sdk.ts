import type { Model } from "../types/Model";
type EquipmentAttributes = {
    serial: string;
};
export declare class Equipment implements Model {
    id: string;
    type: string;
    attributes: EquipmentAttributes;
    meta: any;
    links: any;
    relationships?: any;
    constructor();
    static hydrate(data: any): Equipment;
}
export {};

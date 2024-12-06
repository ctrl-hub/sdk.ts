import type { Model } from "../types/Model";
type EquipmentModelAttributes = {
    name: string;
    documentation: EquipmentModelDocumentation[];
};
type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class EquipmentModel implements Model {
    id: string;
    type: string;
    attributes: EquipmentModelAttributes;
    meta: any;
    links: any;
    relationships?: any;
    constructor();
    static hydrate(data: any): EquipmentModel;
}
export {};

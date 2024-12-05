import type { Model } from "../types/Model";
type VehicleModelAttributes = {
    name: string;
    specification: VehicleModelSpecification;
    documentation: VehicleModelDocumentation[];
};
type VehicleModelSpecification = {
    emissions: string;
    transmission: string;
};
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
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

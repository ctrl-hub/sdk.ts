import type { Model } from "../types/Model";
type VehicleSpecificationAttributes = {
    emissions: number;
    engine: string;
    fuel: string;
    transmission: string;
    year: number;
    documentation: VehicleModelDocumentation[];
};
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class VehicleSpecification implements Model {
    id: string;
    type: string;
    attributes: VehicleSpecificationAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: VehicleSpecification);
    static hydrate(data: VehicleSpecification): VehicleSpecification;
}
export {};

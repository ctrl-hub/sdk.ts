import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class VehicleSpecification implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    emissions: number;
    engine: string;
    fuel: string;
    transmission: string;
    year: number;
    documentation: VehicleModelDocumentation[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): VehicleSpecification;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
export {};

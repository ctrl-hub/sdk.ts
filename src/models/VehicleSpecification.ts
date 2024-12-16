import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

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

type VehicleSpecificationRelationships = {
    model: Relationship;
};

@RegisterModel
export class VehicleSpecification implements Model {
    public id: string = '';
    public type: string = 'vehicle-specifications';
    public attributes: VehicleSpecificationAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: VehicleSpecificationRelationships;
    public included?: any;

    constructor(data?: VehicleSpecification) {
        this.id = data?.id ?? '';
        this.attributes = {
            emissions: data?.attributes?.emissions ?? 0,
            engine: data?.attributes?.engine ?? '',
            fuel: data?.attributes?.fuel ?? '',
            transmission: data?.attributes?.transmission ?? '',
            year: data?.attributes?.year ?? 0,
            documentation: data?.attributes?.documentation ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? 'vehicle-models',
                },
            },
        };
        this.included = data?.included ?? {};
    }

    static hydrate(data: VehicleSpecification): VehicleSpecification {
        return new VehicleSpecification(data);
    }
}

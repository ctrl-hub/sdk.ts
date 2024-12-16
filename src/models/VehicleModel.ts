import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type VehicleModelAttributes = {
    name: string;
};

type VehicleModelRelationships = {
    manufacturer: Relationship;
};

@RegisterModel
export class VehicleModel implements Model {
    public id: string = '';
    public type: string = 'vehicle-models';
    public attributes: VehicleModelAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: VehicleModelRelationships;
    public included?: any;

    constructor(data?: VehicleModel) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? 'vehicle-manufacurers',
                },
            },
        };
        this.included = data?.included ?? {};
    }

    static hydrate(data: VehicleModel): VehicleModel {
        return new VehicleModel(data);
    }
}

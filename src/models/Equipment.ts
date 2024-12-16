import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class Equipment implements Model {
    public id: string = '';
    public type: string = 'equipment-items';
    public meta: any = {};
    public links: any = {};
    public included?: any;
    public _relationships?: any;

    public serial: string = '';

    public model?: EquipmentModel;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'equipment-models'
        }
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.serial = data?.attributes?.serial ?? '';
        this._relationships = data?.relationships ?? {};
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Equipment {
        return new Equipment(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
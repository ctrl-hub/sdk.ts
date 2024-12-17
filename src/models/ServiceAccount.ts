import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { ServiceAccountKey } from '@models/ServiceAccountKey';

@RegisterModel
export class ServiceAccount extends BaseModel {
    declare public id: string;
    public type: string = 'service-accounts';

    public name: string = '';
    public description: string = '';
    public email?: string = '';
    public enabled?: boolean = false;

    public keys?: ServiceAccountKey[] = [];

    getApiMapping() {
        return {
            attributes: ['name', 'description'],
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'keys',
            type: 'array',
            modelType: 'service-account-keys'
        }
    ];

    constructor(data?: any) {
        super(data);

        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
    }

}
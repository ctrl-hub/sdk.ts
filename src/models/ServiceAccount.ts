import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { ServiceAccountKey } from '@models/ServiceAccountKey';

export class ServiceAccount extends BaseModel {
    declare public id: string;
    public type: string = 'service-accounts';

    public name: string = '';
    public description: string = '';
    public email?: string = '';
    public enabled?: boolean = false;

    public keys?: ServiceAccountKey[] = [];

    jsonApiMapping() {
        return {
            attributes: ['name', 'description'],
        };
    }

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);

        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;

        if (data?.attributes?.keys) {
            this.keys = data.attributes.keys.map((key: any) => new ServiceAccountKey(key));
        }

    }

}

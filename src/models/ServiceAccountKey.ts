import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class ServiceAccountKey extends BaseModel {
    public type: string = 'service-account-keys';

    public client_id: string = '';
    public enabled: boolean = false;

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.id = data?.id ?? '';
        this.client_id = data?.attributes?.client_id ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
    }

    static hydrate(data: any): ServiceAccountKey {
        return new ServiceAccountKey(data);
    }
}
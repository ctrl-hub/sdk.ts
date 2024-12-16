import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class ServiceAccount extends BaseModel {
    public type: string = 'service-accounts';

    public name: string = '';
    public description: string = '';
    public email: string = '';
    public enabled: boolean = false;

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

    static hydrate(data: any): ServiceAccount {
        return new ServiceAccount(data);
    }
}
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class Permission extends BaseModel {
    public type: string = 'permissions';

    public description: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.description = data?.attributes?.description ?? '';
    }

    static hydrate(data: any): Permission {
        return new Permission(data);
    }
}
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Permission extends BaseModel {
    public type: string = 'permissions';

    public description: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.description = data?.attributes?.description ?? '';
    }

}
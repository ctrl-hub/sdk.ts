import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Organisation extends BaseModel {
    public type: string = 'organisations';

    static relationships: RelationshipDefinition[] = [];
}

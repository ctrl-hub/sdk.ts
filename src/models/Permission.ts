import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Permission extends BaseModel {
    public type: string = 'permissions';

    public name: string = '';

    public description: string = '';

    public category: string = '';

    public component: string = '';

    public verb: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.category = data?.attributes?.category ?? data?.category ?? '';
        this.component = data?.attributes?.component ?? data?.component ?? '';
        this.verb = data?.attributes?.verb ?? data?.verb
    }

}
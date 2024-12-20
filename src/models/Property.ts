import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Property extends BaseModel {
    public type: string = 'properties';

    public custom: boolean = false;
    public name: string = '';
    public description: string = '';
    public launch_stage: string = '';
    public permissions: string[] = [];

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.custom = data?.attributes?.custom ?? false;
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.launch_stage = data?.attributes?.launch_stage ?? '';
        this.permissions = data?.attributes?.permissions ?? [];
    }

}
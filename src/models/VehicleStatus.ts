import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class VehicleStatus extends BaseModel {
    public type: string = 'vehicle-statuses';

    public name: string = '';

    jsonApiMapping() {
        return {};
    }

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
    }
}

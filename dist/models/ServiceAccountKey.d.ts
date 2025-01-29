import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class ServiceAccountKey extends BaseModel {
    type: string;
    client_id: string;
    enabled: boolean;
    created_at?: Date;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}

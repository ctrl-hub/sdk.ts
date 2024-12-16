import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class ServiceAccountKey extends BaseModel {
    type: string;
    client_id: string;
    enabled: boolean;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): ServiceAccountKey;
}

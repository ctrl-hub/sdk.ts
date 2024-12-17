import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { ServiceAccountKey } from '@models/ServiceAccountKey';
export declare class ServiceAccount extends BaseModel {
    id: string;
    type: string;
    name: string;
    description: string;
    email?: string;
    enabled?: boolean;
    keys?: ServiceAccountKey[];
    getApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): ServiceAccount;
}

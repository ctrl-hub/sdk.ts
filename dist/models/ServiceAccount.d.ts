import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import { ServiceAccountKey } from './ServiceAccountKey';
export declare class ServiceAccount extends BaseModel {
    id: string;
    type: string;
    name: string;
    description: string;
    email?: string;
    enabled?: boolean;
    keys?: ServiceAccountKey[];
    jsonApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}

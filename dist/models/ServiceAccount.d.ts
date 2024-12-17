import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class ServiceAccount extends BaseModel {
    type: string;
    name: string;
    description: string;
    email?: string;
    enabled?: boolean;
    getApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): ServiceAccount;
}

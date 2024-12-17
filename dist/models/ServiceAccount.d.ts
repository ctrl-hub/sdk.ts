import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class ServiceAccount extends BaseModel {
    type: string;
    name: string;
    description: string;
    email: string;
    enabled: boolean;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): ServiceAccount;
}

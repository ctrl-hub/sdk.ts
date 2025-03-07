import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class Organisation extends BaseModel {
    type: string;
    static relationships: RelationshipDefinition[];
}

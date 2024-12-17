import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare abstract class BaseModel implements Model {
    id: string;
    type: string;
    meta?: Record<string, any>;
    links?: Record<string, any>;
    included?: Record<string, any>;
    _relationships?: Record<string, any>;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    toJSON(): Record<string, any>;
}

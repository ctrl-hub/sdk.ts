import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Equipment extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    serial: string;
    model?: EquipmentModel | string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            model: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}

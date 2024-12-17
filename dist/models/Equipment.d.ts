import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class Equipment extends BaseModel {
    type: string;
    serial: string;
    model?: EquipmentModel | string;
    getApiMapping(): {
        attributes: string[];
        relationships: {
            model: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}

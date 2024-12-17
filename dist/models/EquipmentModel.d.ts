import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class EquipmentModel extends BaseModel {
    type: string;
    name: string;
    documentation: EquipmentModelDocumentation[];
    manufacturer?: EquipmentManufacturer;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};

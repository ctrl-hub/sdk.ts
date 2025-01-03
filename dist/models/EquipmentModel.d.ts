import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { EquipmentCategory } from '@models/EquipmentCategory';
type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
type EquipmentModelSpecification = {
    vibration: {
        magnitude: number;
    };
};
export declare class EquipmentModel extends BaseModel {
    type: string;
    name: string;
    description: string;
    specification: EquipmentModelSpecification;
    categories: EquipmentCategory[];
    documentation: EquipmentModelDocumentation[];
    manufacturer?: EquipmentManufacturer;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};

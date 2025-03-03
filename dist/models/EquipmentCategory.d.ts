import { BaseModel } from './BaseModel';
export declare class EquipmentCategory extends BaseModel {
    type: string;
    name: string;
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}

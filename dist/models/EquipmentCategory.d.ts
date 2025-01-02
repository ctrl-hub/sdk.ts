import { BaseModel } from '@models/BaseModel';
export declare class EquipmentCategory extends BaseModel {
    type: string;
    name: string;
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}

import { Client } from '../Client';
import { BaseService } from './BaseService';
import { EquipmentCategory } from '../models/EquipmentCategory';
export declare class EquipmentCategoriesService extends BaseService<EquipmentCategory> {
    constructor(client: Client);
}

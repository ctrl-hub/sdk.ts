import { Client } from 'Client';
import { BaseService } from './BaseService';
import { EquipmentCategory } from '../models/EquipmentCategory';

export class EquipmentCategoriesService extends BaseService<EquipmentCategory> {
    constructor(client: Client) {
        super(client, '/v3/assets/equipment/categories');
    }
}

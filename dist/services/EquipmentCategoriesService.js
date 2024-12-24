import { Client } from 'Client';
import { BaseService } from './BaseService';
import { EquipmentCategory } from '../models/EquipmentCategory';
export class EquipmentCategoriesService extends BaseService {
    constructor(client) {
        super(client, '/v3/assets/equipment/categories');
    }
}

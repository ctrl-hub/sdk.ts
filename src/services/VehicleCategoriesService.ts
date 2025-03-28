import { Client } from 'Client';
import { BaseService } from './BaseService';
import { VehicleCategory } from '../models/VehicleCategory';

export class VehicleCategoriesService extends BaseService<VehicleCategory> {
    constructor(client: Client) {
        super(client, '/v3/assets/vehicles/categories');
    }
}

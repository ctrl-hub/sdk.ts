import { Client } from '../Client';
import { BaseService } from './BaseService';
import { VehicleCategory } from '../models/VehicleCategory';
export declare class VehicleCategoriesService extends BaseService<VehicleCategory> {
    constructor(client: Client);
}

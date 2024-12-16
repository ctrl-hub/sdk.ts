import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class ServiceAccountKey extends BaseModel {
    type = 'service-account-keys';
    client_id = '';
    enabled = false;
    static relationships = [];
    constructor(data) {
        super(data);
        this.id = data?.id ?? '';
        this.client_id = data?.attributes?.client_id ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
    }
    static hydrate(data) {
        return new ServiceAccountKey(data);
    }
}

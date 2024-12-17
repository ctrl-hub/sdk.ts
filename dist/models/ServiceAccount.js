import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class ServiceAccount extends BaseModel {
    type = 'service-accounts';
    name = '';
    description = '';
    email = '';
    enabled = false;
    getApiMapping() {
        return {
            attributes: ['name', 'description'],
        };
    }
    static relationships = [
        {
            name: 'keys',
            type: 'array',
            modelType: 'service-account-keys'
        }
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        if (data?.attributes?.email) {
            this.email = data?.attributes?.email;
        }
        if (data?.attributes?.enabled) {
            this.enabled = data?.attributes?.enabled;
        }
    }
    static hydrate(data) {
        return new ServiceAccount(data);
    }
}

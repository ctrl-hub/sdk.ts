import { BaseModel } from '@models/BaseModel';
export class ServiceAccount extends BaseModel {
    type = 'service-accounts';
    name = '';
    description = '';
    email = '';
    enabled = false;
    keys = [];
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
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
    }
}

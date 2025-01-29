import { BaseModel } from '@models/BaseModel';
import { ServiceAccountKey } from '@models/ServiceAccountKey';
export class ServiceAccount extends BaseModel {
    type = 'service-accounts';
    name = '';
    description = '';
    email = '';
    enabled = false;
    keys = [];
    jsonApiMapping() {
        return {
            attributes: ['name', 'description'],
        };
    }
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
        if (data?.attributes?.keys) {
            this.keys = data.attributes.keys.map((key) => new ServiceAccountKey(key));
        }
    }
}

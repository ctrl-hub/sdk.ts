import { BaseModel } from './BaseModel';
export class ServiceAccountKey extends BaseModel {
    type = 'service-account-keys';
    client_id = '';
    enabled = false;
    created_at;
    static relationships = [];
    constructor(data) {
        super(data);
        this.id = data?.id ?? '';
        this.enabled = data?.attributes?.enabled ?? data?.enabled ?? false;
        let raw_created_at = data?.attributes?.created_at ?? data?.created_at ?? null;
        if (raw_created_at) {
            this.created_at = new Date(raw_created_at);
        }
    }
}

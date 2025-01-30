import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class ServiceAccountKey extends BaseModel {
    public type: string = 'service-account-keys';

    public client_id: string = '';
    public enabled: boolean = false;
    public created_at?: Date;

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.id = data?.id ?? '';
        this.enabled = data?.attributes?.enabled ?? data?.enabled ?? false;

        let raw_created_at = data?.attributes?.created_at ?? data?.created_at ?? null;
        if (raw_created_at) {
            this.created_at = new Date(raw_created_at);
        }
    }

}

import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class CustomerInteraction extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'customer-interactions';

    public method: 'letter' | 'email' | 'telephone' | 'sms';
    public direction: 'inbound' | 'outbound';
    public date_time: string = '';
    public contacted: boolean = false;
    public status: string = '';
    public notes: string = '';

    jsonApiMapping() {
        return {
            attributes: ['method', 'direction', 'date_time', 'contacted', 'status', 'notes'],
            relationships: {
                representative: 'users',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'users',
        },
    ];

    constructor(data?: any) {
        super(data);

        this.method = data?.attributes?.method ?? data?.method ?? '';
        this.direction = data?.attributes?.direction ?? data?.direction ?? '';
        this.date_time = data?.attributes?.date_time ?? data?.date_time ?? '';
        this.contacted = data?.attributes?.contacted ?? data?.contacted ?? false;
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}

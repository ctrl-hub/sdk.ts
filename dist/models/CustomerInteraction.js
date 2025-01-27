import { BaseModel } from '@models/BaseModel';
export class CustomerInteraction extends BaseModel {
    type = 'customer-interactions';
    method;
    direction;
    date_time = '';
    contacted = false;
    status = '';
    notes = '';
    representative;
    jsonApiMapping() {
        return {
            attributes: ['method', 'direction', 'date_time', 'contacted', 'status', 'notes'],
            relationships: {
                representative: 'users',
            },
        };
    }
    static relationships = [
        {
            name: 'representative',
            type: 'single',
            modelType: 'users',
        },
    ];
    constructor(data) {
        super(data);
        this.method = data?.attributes?.method ?? data?.method ?? '';
        this.direction = data?.attributes?.direction ?? data?.direction ?? '';
        this.date_time = data?.attributes?.date_time ?? data?.date_time ?? '';
        this.contacted = data?.attributes?.contacted ?? data?.contacted ?? false;
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}

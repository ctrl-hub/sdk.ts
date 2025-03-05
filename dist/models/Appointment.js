import { BaseModel } from '@models/BaseModel';
export class Appointment extends BaseModel {
    type = 'appointments';
    start_time = '';
    end_time = '';
    notes = '';
    jsonApiMapping() {
        return {
            attributes: ['start_time', 'end_time', 'notes'],
            relationships: {
                customer_interaction: 'customer-interactions',
                operation: 'operations',
            }
        };
    }
    static relationships = [
        {
            name: 'customer_interaction',
            type: 'single',
            modelType: 'customer-interactions',
        },
        {
            name: 'operation',
            type: 'single',
            modelType: 'operations',
        },
    ];
    constructor(data) {
        super(data);
        this.start_time = data?.attributes?.start_time ?? data?.start_time ?? '';
        this.end_time = data?.attributes?.end_time ?? data?.end_time ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}

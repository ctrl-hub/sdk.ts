import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Appointment extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'appointments';

    public start_time: string = '';
    public end_time: string = '';
    public notes: string = '';

    jsonApiMapping() {
        return {
            attributes: ['start_time', 'end_time', 'notes'],
            relationships: {
                customer_interaction: 'customer-interactions',
                operation: 'operations',
            }
        };
    }

    static relationships: RelationshipDefinition[] = [
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

    constructor(data?: any) {
        super(data);

        this.start_time = data?.attributes?.start_time ?? data?.start_time ?? '';
        this.end_time = data?.attributes?.end_time ?? data?.end_time ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}

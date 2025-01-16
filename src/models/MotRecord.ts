import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

interface Defect {
    'dangerous': boolean,
    'text': string;
    'type': string;
}

interface Odometer {
    'type': string;
    'unit': string;
    'value': number;
}

export class MotRecord extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'vehicle-mot-records';

    public completedDate: string = '';
    public dataSource: string = '';
    public defects?: Defect[] = [];
    public expiryDate: string = '';
    public odometer: Odometer = {
        type: 'read',
        unit: 'kilometers',
        value: 0
    }
    public result: string = '';

    jsonApiMapping() {
        return {};
    }

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.completedDate = data?.attributes.completed_date ?? data?.completedDate;
        this.dataSource = data?.attributes.data_source ?? data?.dateSource;
        this.defects = data?.attributes.defects ?? data?.defects;
        this.expiryDate = data?.attributes.expiry_date ?? data?.expiryDate;
        this.odometer = data?.attributes.odometer ?? data?.odometer;
        this.result = data?.attributes.result ?? data?.result;
    }
}

import { BaseModel } from '@models/BaseModel';
export class MotRecord extends BaseModel {
    type = 'vehicle-mot-records';
    completedDate = '';
    dataSource = '';
    defects = [];
    expiryDate = '';
    odometer = {
        type: 'read',
        unit: 'kilometers',
        value: 0
    };
    result = '';
    jsonApiMapping() {
        return {};
    }
    static relationships = [];
    constructor(data) {
        super(data);
        this.completedDate = data?.attributes.completed_date ?? data?.completedDate;
        this.dataSource = data?.attributes.data_source ?? data?.dateSource;
        this.defects = data?.attributes.defects ?? data?.defects;
        this.expiryDate = data?.attributes.expiry_date ?? data?.expiryDate;
        this.odometer = data?.attributes.odometer ?? data?.odometer;
        this.result = data?.attributes.result ?? data?.result;
    }
}

import { BaseModel } from '@models/BaseModel';
export class Street extends BaseModel {
    type = 'streets';
    usrn = 0;
    location = { type: '', coordinates: [] };
    static relationships = [];
    constructor(data) {
        super(data);
        this.usrn = data?.attributes?.usrn ?? data.usrn ?? 0;
        this.location = data?.attributes?.location ?? data.location ?? { type: '', coordinates: [] };
    }
}

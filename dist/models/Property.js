import { BaseModel } from '@models/BaseModel';
export class Property extends BaseModel {
    type = 'properties';
    uprn = 0;
    location = { type: '', coordinates: [] };
    address = { description: '', department: '', organisation: '', number: '', name: '', thoroughfare: '', dependent_thoroughfare: '', post_town: '', postcode: '', pobox: '', country: '' };
    psr = { indicator: false, priority: 0, notes: '', contact: '' };
    pressure_tests = { source: '', id: '' };
    mprn = 0;
    mpan = 0;
    static relationships = [
        {
            name: 'pressure_tests',
            type: 'array',
            modelType: 'pressure-tests',
        },
    ];
    constructor(data) {
        super(data);
        this.uprn = data?.attributes?.uprn ?? data?.uprn ?? 0;
        this.location = data?.attributes?.location ?? data?.location ?? { type: '', coordinates: [] };
        this.address = data?.attributes?.address ?? data?.address ?? { description: '', department: '', organisation: '', number: '', name: '', thoroughfare: '', dependent_thoroughfare: '', post_town: '', postcode: '', pobox: '', country: '' };
        this.psr = data?.attributes?.psr ?? data?.psr ?? { indicator: false, priority: 0, notes: '', contact: '' };
        this.pressure_tests = data?.attributes?.pressure_tests ?? data?.pressure_tests ?? { source: '', id: '' };
        this.mprn = data?.attributes?.mprn ?? data?.mprn ?? 0;
        this.mpan = data?.attributes?.mpan ?? data?.mpan ?? 0;
    }
}

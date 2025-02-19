import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Property extends BaseModel {
    public type: string = 'properties';

    public uprn: number = 0;
    public location: Location = { type: '', coordinates: [] };
    public address: Address = { description: '', department: '', organisation: '', number: '', name: '', thoroughfare: '', dependent_thoroughfare: '', post_town: '', postcode: '', pobox: '', country: '' };
    public psr: PSR = { indicator: false, priority: 0, notes: '', contact: '' };
    public pressure_tests: PressureTest = { source: '', id: '' };
    public mprn: number = 0;
    public mpan: number = 0;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'pressure_tests',
            type: 'array',
            modelType: 'pressure-tests',
        },
    ];

    constructor(data?: any) {
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

type Location = {
    type: String;
    coordinates: Array<number>;
}

type Address = {
    description: String;
    department: String;
    organisation: String;
    number: String;
    name: String;
    thoroughfare: String;
    dependent_thoroughfare: String;
    post_town: String;
    postcode: String;
    pobox: String;
    country: String;
}

type PSR = {
    indicator: boolean;
    priority: number;
    notes: String;
    contact: String;
}

type PressureTest = {
    source: String;
    id: String;
}

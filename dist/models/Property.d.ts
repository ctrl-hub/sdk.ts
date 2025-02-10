import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class Property extends BaseModel {
    type: string;
    uprn: number;
    location: Location;
    address: Address;
    psr: PSR;
    pressure_tests: PressureTest;
    mprn: number;
    mpan: number;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
type Location = {
    type: String;
    coordinates: Array<number>;
};
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
};
type PSR = {
    indicator: boolean;
    priority: number;
    notes: String;
    contact: String;
};
type PressureTest = {
    source: String;
    id: String;
};
export {};

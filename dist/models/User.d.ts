import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
interface Identity {
    id: string;
    platform: string;
    meta?: {
        organisation_id?: string;
    } | null;
}
interface Address {
    area: string;
    country_code: string;
    county: string;
    name: string;
    number: string;
    postcode: string;
    street: string;
    town: string;
    what3words: string;
}
interface Contact {
    landline: string;
    mobile: string;
}
interface Personal {
    dob: string;
    first_name: string;
    last_name: string;
    username: string;
}
interface Settings {
    preferred_language: string;
    timezone: string;
}
interface Work {
    cscs: string;
    eusr: string;
    occupation: string;
    start_date: string;
}
interface Profile {
    address: Address;
    contact: Contact;
    personal: Personal;
    settings: Settings;
    work: Work;
}
export declare class User extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    email: string;
    identities: Identity[];
    profile: Profile;
    jsonApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    label: () => string;
}
export {};

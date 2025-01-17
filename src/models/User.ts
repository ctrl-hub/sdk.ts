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

export class User extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'users';

    public email: string = '';
    public identities: Identity[] = [];

    public profile: Profile = {
        address: {
            area: '',
            country_code: '',
            county: '',
            name: '',
            number: '',
            postcode: '',
            street: '',
            town: '',
            what3words: ''
        },
        contact: {
            landline: '',
            mobile: ''
        },
        personal: {
            dob: '',
            first_name: '',
            last_name: '',
            username: ''
        },
        settings: {
            preferred_language: '',
            timezone: ''
        },
        work: {
            cscs: '',
            eusr: '',
            occupation: '',
            start_date: ''
        }
    };

    jsonApiMapping() {
        return {
            attributes: ['email', 'identities', 'profile']
        };
    }

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);

        this.email = data?.attributes?.email ?? '';
        this.identities = data?.attributes?.identities ?? [];

        if (data?.attributes?.profile) {
            const profileData = data.attributes.profile;

            this.profile = {
                address: {
                    area: profileData.address?.area ?? '',
                    country_code: profileData.address?.country_code ?? '',
                    county: profileData.address?.county ?? '',
                    name: profileData.address?.name ?? '',
                    number: profileData.address?.number ?? '',
                    postcode: profileData.address?.postcode ?? '',
                    street: profileData.address?.street ?? '',
                    town: profileData.address?.town ?? '',
                    what3words: profileData.address?.what3words ?? ''
                },
                contact: {
                    landline: profileData.contact?.landline ?? '',
                    mobile: profileData.contact?.mobile ?? ''
                },
                personal: {
                    dob: profileData.personal?.dob ?? '',
                    first_name: profileData.personal?.first_name ?? '',
                    last_name: profileData.personal?.last_name ?? '',
                    username: profileData.personal?.username ?? ''
                },
                settings: {
                    preferred_language: profileData.settings?.preferred_language ?? '',
                    timezone: profileData.settings?.timezone ?? ''
                },
                work: {
                    cscs: profileData.work?.cscs ?? '',
                    eusr: profileData.work?.eusr ?? '',
                    occupation: profileData.work?.occupation ?? '',
                    start_date: profileData.work?.start_date ?? ''
                }
            };
        }
    }

    label = () => {
        if (this.profile.personal.first_name && this.profile.personal.last_name) {
            return this.profile.personal.first_name + ' ' + this.profile.personal.last_name;
        }
        return this.email;
    }
}

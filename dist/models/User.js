import { BaseModel } from '@models/BaseModel';
export class User extends BaseModel {
    type = 'users';
    email = '';
    identities = [];
    profile = {
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
    static relationships = [];
    constructor(data) {
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
}

import type { Model } from "../types/Model";

type PropertyAttributes = {
    address: {
        description: string;
        department: string;
        organisation: string;
        number: string;
        name: string;
        thoroughfare: string;
        dependent_thoroughfare: string;
        post_town: string;
        postcode: string;
        pobox: string;
        country: string;
    },
    location: {
        type: string;
        coordinates: number[];
    },
    mpan: number;
    mprn: number;
    psr: {
        indicator: boolean;
        priority: number;
        notes: string;
        contact: string;
    };
    uprn: number;
};

export class Property implements Model {
    public id: string = '';
    public type: string = 'properties';
    public attributes: PropertyAttributes;

    constructor() {
        this.attributes = {
            address: {
                description: '',
                department: '',
                organisation: '',
                number: '',
                name: '',
                thoroughfare: '',
                dependent_thoroughfare: '',
                post_town: '',
                postcode: '',
                pobox: '',
                country: '',
            },
            location: {
                type: '',
                coordinates: [],
            },
            mpan: 0,
            mprn: 0,
            psr: {
                indicator: false,
                priority: 0,
                notes: '',
                contact: '',
            },
            uprn: 0,
        }
    }

    static hydrate(data: any) {
        let property = new Property();

        if (data) {
            property.id = data.id || '';
            property.attributes.address = data.attributes.address || property.attributes.address;
            property.attributes.location = data.attributes.location || property.attributes.location;
            property.attributes.mpan = data.attributes.mpan || property.attributes.mpan;
            property.attributes.mprn = data.attributes.mprn || property.attributes.mprn;
            property.attributes.psr = data.attributes.psr || property.attributes.psr;
            property.attributes.uprn = data.attributes.uprn || property.attributes.uprn;
        }

        return property;
    }

    links: any;
    meta: any;
}
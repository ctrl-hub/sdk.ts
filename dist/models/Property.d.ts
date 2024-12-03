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
    };
    location: {
        type: string;
        coordinates: number[];
    };
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
export declare class Property implements Model {
    id: string;
    type: string;
    attributes: PropertyAttributes;
    constructor();
    static hydrate(data: any): Property;
    links: any;
    meta: any;
}
export {};

import { ClientInterface } from "../interfaces/ClientInterface";

type FormCategoryAttributes = {
    name: string;
    location: {
        coordinates: number[];
    }
};

export class FormCategory implements ClientInterface {
    public id: string;
    endpoint: string = '/v3/orgs/:orgId/data-capture/form-categories';
    type: string = 'form-categories';
    attributes: FormCategoryAttributes;

    constructor() {
        this.attributes = {
            name: '',
            location: {
                coordinates: []
            }
        };
    }
}
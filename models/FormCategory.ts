import { ModelInterface } from "../interfaces/ModelInterface";

type FormCategoryAttributes = {
    name: string;
    location: {
        coordinates: number[];
    }
};

export class FormCategory implements ModelInterface {
    public id: string = '';
    public type: string = 'form-categories';
    public attributes: FormCategoryAttributes;
    public meta: any = {};

    constructor(data?: Partial<FormCategoryAttributes>, id?: string, type?: string, meta?: any) {
        this.attributes = {
            name: '',
            location: {
                coordinates: []
            }
        };

        if (data) {
            this.attributes.name = data.name || '';
            this.attributes.location.coordinates = data.location?.coordinates || [];
        }

        if (id) {
            this.id = id;
        }

        if (type) {
            this.type = type;
        }

        if (meta) {
            this.meta = meta;
        }
    }
}
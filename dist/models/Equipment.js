import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Equipment {
    id = '';
    type = 'equipment-items';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            serial: data?.attributes?.serial ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? '',
                }
            },
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? '',
                }
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Equipment(data);
    }
}

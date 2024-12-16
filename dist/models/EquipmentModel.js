import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class EquipmentModel {
    id = '';
    type = 'equipment-models';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            documentation: data?.attributes?.documentation ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? 'equipment-manufacturers',
                },
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new EquipmentModel(data);
    }
}

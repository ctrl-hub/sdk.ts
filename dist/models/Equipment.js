export class Equipment {
    id = '';
    type = 'equipment-items';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            serial: '',
        };
    }
    static hydrate(data) {
        let equipment = new Equipment();
        if (data) {
            equipment.id = data.id || '';
            equipment.type = data.type || 'equipment-items';
            equipment.relationships = data.relationships || {};
            equipment.attributes.serial = data.attributes.serial || '';
            equipment.meta = data.meta || {};
            equipment.links = data.links || {};
        }
        return equipment;
    }
}

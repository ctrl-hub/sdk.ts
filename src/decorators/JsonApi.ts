/**
 * Used to denote which of the properties of a model should go into the .attributes of a JSON API payload
 * e.g. on Equipment.ts model:
 *
 *     @JsonApiAttribute()
 *     public serial: string = '';
 *
 * means that the payload will have a .attributes.serial field with the value of this.serial
 */
export function JsonApiAttribute(): PropertyDecorator {
    return function(target: Object, propertyKey: string | symbol) {
        const constructor = target.constructor as any;
        if (!constructor._jsonApiAttributes) {
            constructor._jsonApiAttributes = new Set<string>();
        }
        constructor._jsonApiAttributes.add(propertyKey.toString());
    };
}

/**
 * Used to denote a relationship between two models in a JSON API payload
 *
 * Example:
 *     @JsonApiRelationship('equipment-models')
 *     public model?: EquipmentModel | string = '';
 * 
 * The relationship type (single vs multiple) is inferred from the actual valeu
 * at runtime - if it's an array, it's treated as a multiple relationship.
 */
export function JsonApiRelationship(modelType: string): PropertyDecorator {
    return function(target: Object, propertyKey: string | symbol) {
        const constructor = target.constructor as any;

        if (!constructor._jsonApiRelationships) {
            constructor._jsonApiRelationships = new Map<string, {type: string}>();
        }

        constructor._jsonApiRelationships.set(propertyKey.toString(), {
            type: modelType
        });
    };
}
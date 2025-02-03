export class JsonApiSerializer {
    modelMap;
    constructor(modelMap) {
        this.modelMap = modelMap;
    }
    buildCreatePayload(model) {
        const ModelClass = this.modelMap[model.type];
        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model);
        }
        const prototype = ModelClass.prototype;
        if (typeof prototype.jsonApiMapping === 'function') {
            const mapping = prototype.jsonApiMapping.call(model);
            const payload = {
                data: {
                    type: model.type,
                    attributes: {},
                    relationships: {},
                },
            };
            if (mapping.attributes) {
                mapping.attributes.forEach((attr) => {
                    const value = model[attr];
                    if (value !== undefined && value !== '') {
                        payload.data.attributes[attr] = value;
                    }
                });
            }
            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
                    const relationshipValue = model[key];
                    if (relationshipValue && typeof relationshipType === 'string') {
                        payload.data.relationships[key] = {
                            data: {
                                type: relationshipType,
                                id: relationshipValue,
                            },
                        };
                    }
                });
            }
            return payload;
        }
        return this.buildDefaultPayload(model);
    }
    castAttribute(value, castType) {
        if (castType === 'date') {
            return new Date(value);
        }
        return value;
    }
    buildUpdatePayload(model) {
        const ModelClass = this.modelMap[model.type];
        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model);
        }
        const prototype = ModelClass.prototype;
        if (typeof prototype.jsonApiMapping === 'function') {
            const mapping = prototype.jsonApiMapping.call(model);
            const payload = {
                data: {
                    id: model.id,
                    type: model.type,
                    attributes: {},
                    relationships: {},
                },
            };
            if (mapping.attributes) {
                mapping.attributes.forEach((attr) => {
                    let value = model[attr];
                    if (value !== undefined && value !== '') {
                        if (mapping.attributeCasts && Object.keys(mapping.attributeCasts).includes(attr)) {
                            let val2 = this.castAttribute(value, mapping.attributeCasts[attr]);
                            alert(val2);
                        }
                        payload.data.attributes[attr] = value;
                    }
                });
            }
            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
                    const relationshipValue = model[key];
                    if (relationshipValue && typeof relationshipType === 'string') {
                        payload.data.relationships[key] = {
                            data: {
                                type: relationshipType,
                                id: relationshipValue.id ?? relationshipValue,
                            },
                        };
                    }
                });
            }
            return payload;
        }
        return this.buildDefaultPayload(model);
    }
    buildDefaultPayload(model) {
        const { type, id, meta, links, included, _relationships, ...attributes } = model;
        return {
            data: {
                type: model.type,
                attributes,
            },
        };
    }
}

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
    buildRelationshipPayload(model, relationships) {
        const ModelClass = this.modelMap[model.type];
        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return { data: [] };
        }
        const data = relationships
            .filter(relationship => relationship.id !== undefined)
            .map(relationship => ({
            type: model.type,
            id: relationship.id,
        }));
        const payload = {
            data: data,
        };
        return payload;
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

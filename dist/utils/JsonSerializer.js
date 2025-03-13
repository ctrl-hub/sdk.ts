export class JsonApiSerializer {
    modelMap;
    constructor(modelMap) {
        this.modelMap = modelMap;
    }
    buildCreatePayload(model) {
        return this.buildPayload(model, false);
    }
    buildUpdatePayload(model) {
        return this.buildPayload(model, true);
    }
    buildPayload(model, isUpdate) {
        const ModelClass = this.modelMap[model.type];
        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model, isUpdate);
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
            if (isUpdate && model.id) {
                payload.data.id = model.id;
            }
            prototype.constructor.relationships.forEach((relationship) => {
                if (relationship.type === 'array') {
                    const value = model[relationship.name];
                    if (value) {
                        payload.data.relationships[relationship.name] = {
                            data: value.map((item) => ({
                                type: relationship.modelType,
                                id: item.id,
                            })),
                        };
                    }
                }
                else {
                    const value = model[relationship.name];
                    if (value) {
                        payload.data.relationships[relationship.name] = {
                            data: {
                                type: relationship.modelType,
                                id: typeof value === 'string' ? value : value.id,
                            },
                        };
                    }
                }
            });
            if (mapping.attributes) {
                mapping.attributes.forEach((attr) => {
                    const value = model[attr];
                    if (value !== undefined && value !== '') {
                        payload.data.attributes[attr] = value;
                    }
                });
            }
            return payload;
        }
        return this.buildDefaultPayload(model, isUpdate);
    }
    buildRelationshipPayload(model, relationships) {
        const ModelClass = this.modelMap[model.type];
        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return { data: [] };
        }
        if (!Array.isArray(relationships)) {
            if (relationships?.id !== undefined) {
                return {
                    data: {
                        type: model.type,
                        id: relationships.id
                    }
                };
            }
            return { data: null };
        }
        const data = relationships
            .filter(relationship => relationship.id !== undefined)
            .map(relationship => ({
            type: model.type,
            id: relationship.id,
        }));
        return { data };
    }
    buildDefaultPayload(model, includeId) {
        const { type, id, meta, links, included, _relationships, ...attributes } = model;
        const payload = {
            data: {
                type: model.type,
                attributes,
            },
        };
        if (includeId && id) {
            payload.data.id = id;
        }
        return payload;
    }
}

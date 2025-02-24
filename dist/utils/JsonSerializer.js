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
                                id: value.id,
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
                                id: value.id,
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

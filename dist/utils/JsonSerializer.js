export class JsonApiSerializer {
    static buildCreatePayload(model) {
        if ('getApiMapping' in model) {
            const mapping = model.getApiMapping();
            const payload = {
                data: {
                    type: model.type,
                    attributes: {},
                    relationships: {}
                }
            };
            mapping.attributes?.forEach((attr) => {
                let toAdd = model[attr];
                console.log(attr + ' ' + toAdd);
                payload.data.attributes[attr] = model[attr];
            });
            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, type]) => {
                    const relationshipValue = model[key];
                    if (relationshipValue) {
                        payload.data.relationships[key] = {
                            data: {
                                type,
                                id: relationshipValue
                            }
                        };
                    }
                });
            }
            return payload;
        }
        // default to using all attributes (anything that's not type or id)
        const { type, id, ...attributes } = model;
        return {
            data: {
                type: model.type,
                attributes
            }
        };
    }
}

import type { Model } from '../types/Model';

export class JsonApiSerializer {
    static buildCreatePayload(model: Model): {
        data: {
            type: string;
            attributes: Record<string, any>;
            relationships?: Record<string, { data: { type: string, id: string } }>;
        }
    } {
        if ('getApiMapping' in model) {
            const mapping = (model as any).getApiMapping() as {
                attributes?: string[];
                relationships?: Record<string, string>;
            };

            const payload = {
                data: {
                    type: model.type,
                    attributes: {} as Record<string, any>,
                    relationships: {} as Record<string, { data: { type: string, id: string } }>
                }
            };

            mapping.attributes?.forEach((attr: string) => {
                let toAdd = (model as any)[attr];
                console.log(attr + ' ' + toAdd);
                payload.data.attributes[attr] = (model as any)[attr];
            });

            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, type]) => {
                    const relationshipValue = (model as any)[key];
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
        const {type, id, ...attributes} = model;
        return {
            data: {
                type: model.type,
                attributes
            }
        };
    }
}
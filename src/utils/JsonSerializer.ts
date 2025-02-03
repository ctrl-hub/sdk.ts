import type { Model } from '../types/Model';
import type { JsonApiMapping } from '../types/JsonApiMapping';

type JsonApiRelationship = {
    data: {
        type: string;
        id: string;
    };
};

type JsonApiPayload = {
    data: {
        id?: string;
        type: string;
        attributes: Record<string, any>;
        relationships?: Record<string, JsonApiRelationship>;
    };
};

export class JsonApiSerializer {
    protected modelMap: Record<string, new (...args: any[]) => Model>;

    constructor(modelMap: Record<string, new (...args: any[]) => Model>) {
        this.modelMap = modelMap;
    }

    buildCreatePayload(model: Model & Partial<JsonApiMapping>): JsonApiPayload {
        const ModelClass = this.modelMap[model.type];

        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model);
        }

        const prototype = ModelClass.prototype;

        if (typeof prototype.jsonApiMapping === 'function') {
            const mapping = prototype.jsonApiMapping.call(model);

            const payload: JsonApiPayload = {
                data: {
                    type: model.type,
                    attributes: {},
                    relationships: {},
                },
            };

            if (mapping.attributes) {
                mapping.attributes.forEach((attr: string) => {
                    const value = (model as any)[attr];
                    if (value !== undefined && value !== '') {
                        payload.data.attributes[attr] = value;
                    }
                });
            }

            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
                    const relationshipValue = (model as any)[key];
                    if (relationshipValue && typeof relationshipType === 'string') {
                        payload.data.relationships![key] = {
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

    castAttribute(value: any, castType: string): any {
        if (castType === 'date') {
            return new Date(value).toISOString();
        }
        return value
    }

    buildUpdatePayload(model: Model & Partial<JsonApiMapping>): JsonApiPayload {
        const ModelClass = this.modelMap[model.type];

        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model);
        }

        const prototype = ModelClass.prototype;

        if (typeof prototype.jsonApiMapping === 'function') {
            const mapping = prototype.jsonApiMapping.call(model);

            const payload: JsonApiPayload = {
                data: {
                    id: model.id,
                    type: model.type,
                    attributes: {},
                    relationships: {},
                },
            };

            if (mapping.attributes) {
                mapping.attributes.forEach((attr: string) => {
                    let value = (model as any)[attr];
                    if (value !== undefined && value !== '') {

                        // e.g. cast to date
                        if(mapping.attributeCasts && Object.keys(mapping.attributeCasts).includes(attr)) {
                            value = this.castAttribute(value, mapping.attributeCasts[attr]);
                        }

                        payload.data.attributes[attr] = value;
                    }
                });
            }

            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
                    const relationshipValue = (model as any)[key];
                    if (relationshipValue && typeof relationshipType === 'string') {
                        payload.data.relationships![key] = {
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

    private buildDefaultPayload(model: Model): JsonApiPayload {
        const { type, id, meta, links, included, _relationships, ...attributes } = model;
        return {
            data: {
                type: model.type,
                attributes,
            },
        };
    }
}

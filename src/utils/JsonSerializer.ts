import type { Model } from '../types/Model';
import type { JsonApiMapping } from '../types/JsonApiMapping';

type JsonApiRelationship = {
    data: {
        type: string;
        id: string;
    };
};

type JsonApiRelationshipsPayload = {
    data: {
        type: string;
        id: string;
    } | Array<{
        type: string;
        id: string;
    }> | null;
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
        return this.buildPayload(model, false);
    }

    buildUpdatePayload(model: Model & Partial<JsonApiMapping>): JsonApiPayload {
        return this.buildPayload(model, true);
    }

    private buildPayload(model: Model & Partial<JsonApiMapping>, isUpdate: boolean): JsonApiPayload {
        const ModelClass = this.modelMap[model.type];

        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return this.buildDefaultPayload(model, isUpdate);
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

            if (isUpdate && model.id) {
                payload.data.id = model.id;
            }

            prototype.constructor.relationships.forEach((relationship: {
                name: string;
                type: string;
                modelType: string;
            }) => {
                if (relationship.type === 'array') {
                    const value = (model as any)[relationship.name];
                    if (value) {
                        payload.data.relationships![relationship.name] = {
                            data: value.map((item: any) => ({
                                type: relationship.modelType,
                                id: item.id,
                            })),
                        };
                    }
                } else {
                    const value = (model as any)[relationship.name];
                    if (value) {
                        payload.data.relationships![relationship.name] = {
                            data: {
                                type: relationship.modelType,
                                id: typeof value === 'string' ? value : value.id,
                            },
                        };
                    }
                }
            });

            if (mapping.attributes) {
                mapping.attributes.forEach((attr: string) => {
                    const value = (model as any)[attr];
                    if (value !== undefined && value !== '') {
                        payload.data.attributes[attr] = value;
                    }
                });
            }

            return payload;
        }

        return this.buildDefaultPayload(model, isUpdate);
    }

    buildRelationshipPayload(model: Model, relationships: Model | Array<Model>): JsonApiRelationshipsPayload {
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
                        id: relationships.id!
                    }
                };
            }
            return { data: null };
        }

        const data = relationships
            .filter(relationship => relationship.id !== undefined)
            .map(relationship => ({
                type: model.type,
                id: relationship.id!,
            }));

        return { data };
    }

    private buildDefaultPayload(model: Model, includeId: boolean): JsonApiPayload {
        const { type, id, meta, links, included, _relationships, ...attributes } = model;

        const payload: JsonApiPayload = {
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
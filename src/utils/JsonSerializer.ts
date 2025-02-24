import type { Model } from '../types/Model';
import type { JsonApiMapping } from '../types/JsonApiMapping';

// Updated type definitions
type JsonApiResourceIdentifier = {
    type: string;
    id: string;
};

type JsonApiRelationship = {
    data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[];
};

type JsonApiRelationshipsPayload = {
    data: JsonApiResourceIdentifier[];
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

        const payload: JsonApiPayload = {
            data: {
                type: model.type,
                attributes: {},
            },
        };

        if (isUpdate && model.id) {
            payload.data.id = model.id;
        }

        // Check for decorator-based attributes
        if ((ModelClass as any)._jsonApiAttributes) {
            const attributeKeys = Array.from((ModelClass as any)._jsonApiAttributes as Set<string>);
            attributeKeys.forEach((attr: string) => {
                const value = (model as any)[attr];
                if (value !== undefined && value !== '') {
                    payload.data.attributes[attr] = value;
                }
            });
        }

        // Check for enhanced decorator-based relationships (infer type from value)
        if ((ModelClass as any)._jsonApiRelationships) {

            const relationshipEntries = Array.from(
                (ModelClass as any)._jsonApiRelationships as Map<string, {type: string}>
            );

            relationshipEntries.forEach(([propName, relationshipInfo]) => {
                const value = (model as any)[propName];

                // Skip if value is undefined, null, or an empty array
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    return;
                }

                if (Array.isArray(value)) {
                    // It's a multiple relationship (array of models or IDs)
                    if (!payload.data.relationships) {
                        payload.data.relationships = {};
                    }
                    payload.data.relationships[propName] = {
                        data: value.map((item: any) => ({
                            type: relationshipInfo.type,
                            id: typeof item === 'string' ? item : item.id,
                        })) as JsonApiResourceIdentifier[],
                    };
                } else {
                    // It's a single relationship (one model object or a string ID)
                    if (!payload.data.relationships) {
                        payload.data.relationships = {};
                    }
                    payload.data.relationships[propName] = {
                        data: {
                            type: relationshipInfo.type,
                            id: typeof value === 'string' ? value : value.id,
                        } as JsonApiResourceIdentifier,
                    };
                }
            });
        }

        // If we found attributes or relationships through decorators, return the payload
        const hasDecoratorData =
            ((ModelClass as any)._jsonApiAttributes &&
                ((ModelClass as any)._jsonApiAttributes as Set<string>).size > 0) ||
            ((ModelClass as any)._jsonApiRelationships &&
                ((ModelClass as any)._jsonApiRelationships as Map<string, any>).size > 0);

        if (hasDecoratorData) {
            return payload;
        }

        const prototype = ModelClass.prototype;

        if (typeof prototype.jsonApiMapping === 'function') {
            const mapping = prototype.jsonApiMapping.call(model);

            if (mapping.attributes) {
                mapping.attributes.forEach((attr: string) => {
                    const value = (model as any)[attr];
                    if (value !== undefined && value !== '') {
                        payload.data.attributes[attr] = value;
                    }
                });
            }

            if (mapping.relationships) {
                // Handle relationships - either as array of strings or as an object
                if (Array.isArray(mapping.relationships)) {
                    mapping.relationships.forEach((relationName: string) => {
                        const relationship = prototype.constructor.relationships.find(
                            (r: any) => r.name === relationName
                        );

                        if (relationship) {
                            const value = (model as any)[relationship.name];
                            if (value) {
                                if (relationship.type === 'array') {
                                    payload.data.relationships![relationship.name] = {
                                        data: value.map((item: any) => ({
                                            type: relationship.modelType,
                                            id: item.id,
                                        })) as JsonApiResourceIdentifier[],
                                    };
                                } else {
                                    payload.data.relationships![relationship.name] = {
                                        data: {
                                            type: relationship.modelType,
                                            id: typeof value === 'string' ? value : value.id,
                                        } as JsonApiResourceIdentifier,
                                    };
                                }
                            }
                        }
                    });
                } else {
                    // Handle relationships as an object mapping
                    Object.entries(mapping.relationships).forEach(([propName, relationType]) => {
                        const value = (model as any)[propName];
                        if (value) {
                            if (Array.isArray(value)) {
                                payload.data.relationships![propName] = {
                                    data: value.map((item: any) => ({
                                        type: relationType as string,
                                        id: typeof item === 'string' ? item : item.id,
                                    })) as JsonApiResourceIdentifier[],
                                };
                            } else {
                                payload.data.relationships![propName] = {
                                    data: {
                                        type: relationType as string,
                                        id: typeof value === 'string' ? value : value.id,
                                    } as JsonApiResourceIdentifier,
                                };
                            }
                        }
                    });
                }
            }

            return payload;
        }

        return this.buildDefaultPayload(model, isUpdate);
    }

    buildRelationshipPayload(model: Model, relationships: Array<Model>): JsonApiRelationshipsPayload {
        const ModelClass = this.modelMap[model.type];

        if (!ModelClass) {
            console.warn(`No model class found for type: ${model.type}`);
            return { data: [] };
        }

        const data = relationships
            .filter(relationship => relationship.id !== undefined)
            .map(relationship => ({
                type: model.type,
                id: relationship.id!,
            })) as JsonApiResourceIdentifier[];

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

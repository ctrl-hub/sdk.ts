import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

export abstract class BaseModel implements Model {
    public id: string = '';

    public type: string = '';
    public meta?: Record<string, any>;
    public links?: Record<string, any>;
    public included?: Record<string, any>;
    public _relationships?: Record<string, any>;

    static relationships: RelationshipDefinition[] = [];
    static _jsonApiRelationships?: Map<string, {type: string}>;

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.type = data?.type ?? '';

        // Only set optional properties if they have content
        if (data?.meta && Object.keys(data.meta).length > 0) {
            this.meta = data.meta;
        }

        if (data?.links && Object.keys(data.links).length > 0) {
            this.links = data.links;
        }

        if (data?.included && Object.keys(data.included).length > 0) {
            this.included = data.included;
        }

        if (data?.relationships && Object.keys(data.relationships).length > 0) {
            this._relationships = data.relationships;
        }
        
        // Process @JsonApiRelationship properties
        const constructor = this.constructor as typeof BaseModel;
        if (constructor._jsonApiRelationships) {
            constructor._jsonApiRelationships.forEach((relationshipConfig, prop) => {
                // Only assign if the relationship exists in data
                if (data?.relationships?.[prop]?.data) {
                    (this as any)[prop] = data.relationships[prop].data.id;
                } else if (data && prop in data) {
                    (this as any)[prop] = data[prop];
                }
            });
        }
    }

    toJSON() {
        const obj: Record<string, any> = {};

        if (this.id) obj.id = this.id;
        if (this.type) obj.type = this.type;
        if (this.meta) obj.meta = this.meta;
        if (this.links) obj.links = this.links;

        for (const [key, value] of Object.entries(this)) {
            // Skip the base properties already handled
            if (['id', 'type', 'meta', 'links', 'included', '_relationships'].includes(key)) {
                continue;
            }

            if (value !== null && value !== undefined) {
                if (typeof value === 'object' && Object.keys(value).length === 0) {
                    continue;
                }
                obj[key] = value;
            }
        }

        return obj;
    }
}

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

    constructor(data?: any) {
        this.id = data?.id ?? '';

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
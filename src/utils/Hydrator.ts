import { ModelRegistry } from './ModelRegistry';
import type { JsonData } from '../types/Response';
import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import type { ModelConstructor } from '../types/ModelConstructor';

interface RelationData {
    id: string;
    type: string;
    [key: string]: any;
}

export class Hydrator {
    constructor(private modelRegistry: ModelRegistry) {}

    hydrateResponse<T extends Model>(data: JsonData | JsonData[], included: any[]): T | T[] {
        return Array.isArray(data)
            ? this.hydrateArray<T>(data, included)
            : this.hydrateSingle<T>(data, included);
    }

    private hydrateArray<T extends Model>(items: JsonData[], included: any[]): T[] {
        return items.map(item => this.hydrateSingle<T>(item, included));
    }

    private hydrateSingle<T extends Model>(item: JsonData, included: any[]): T {
        const ModelClass = this.modelRegistry.models[item.type];
        if (!ModelClass) {
            throw new Error(`No model found for type: ${item.type}`);
        }

        const hydratedItem = ModelClass.hydrate(item) as T;
        return this.hydrateRelationships(hydratedItem, included, ModelClass) as T;
    }

    private hydrateRelationships<T extends Model>(
        item: T,
        included: any[],
        ModelClass: ModelConstructor<T>
    ): T {
        if (!ModelClass.relationships) return item;

        ModelClass.relationships.forEach((relationDef: RelationshipDefinition) => {
            const relationData = item._relationships?.[relationDef.name]?.data;
            if (!relationData) return;

            if (relationDef.type === 'array') {
                (item as any)[relationDef.name] = Array.isArray(relationData)
                    ? relationData.map(relation => this.hydrateRelation(relation, included))
                    : [];
            } else {
                (item as any)[relationDef.name] = this.hydrateRelation(relationData, included);
            }
        });

        return item;
    }

    private hydrateRelation(relation: RelationData, included: any[]) {
        const includedData = this.findMatchingIncluded(relation, included);
        if (!includedData) return relation;

        const ModelClass = this.modelRegistry.models[relation.type];
        if (!ModelClass) return includedData;

        const hydratedModel = ModelClass.hydrate(includedData);
        return this.hydrateRelationships(hydratedModel, included, ModelClass);
    }

    private findMatchingIncluded(relation: RelationData, included: any[]) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}
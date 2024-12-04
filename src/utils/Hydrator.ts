import { ModelRegistry } from './ModelRegistry';
import type { Model } from '../types/Model';

interface JsonData {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, { data: any[] }>;
    meta?: Record<string, any>;
    links?: string[];
}

interface RelationData {
    id: string;
    type: string;
    [key: string]: any;
}

export class Hydrator {
    constructor(private modelRegistry: ModelRegistry) {}

    hydrateResponse<T>(data: JsonData | JsonData[], included: any[]): T | T[] {
        return Array.isArray(data)
            ? this.hydrateArray<T>(data, included)
            : this.hydrateSingle<T>(data, included);
    }

    private hydrateArray<T>(items: JsonData[], included: any[]): T[] {
        return items.map(item => this.hydrateSingle<T>(item, included));
    }

    private hydrateSingle<T>(item: JsonData, included: any[]): T {
        const ModelClass = this.modelRegistry.models[item.type];
        if (!ModelClass) {
            throw new Error(`No model found for type: ${item.type}`);
        }

        const hydratedItem = ModelClass.hydrate(item);
        return this.hydrateRelationships(hydratedItem as JsonData, included);
    }

    private hydrateRelationships<T>(item: JsonData, included: any[]): T {
        if (!item.relationships || !included) return item as T;

        Object.entries(item.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;
            if (!data) return;

            const hydrateRelation = (relation: RelationData) => {
                const includedData = this.findMatchingIncluded(relation, included);

                try {
                    const ModelClass = this.modelRegistry.models[relation.type];
                    return ModelClass ? ModelClass.hydrate(includedData) : includedData;
                } catch (e) {
                    return includedData;
                }
            };

            relationship.data = Array.isArray(data)
                ? data.map(hydrateRelation)
                : hydrateRelation(data);
        });

        return item as T;
    }

    private findMatchingIncluded(relation: RelationData, included: any[]) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}
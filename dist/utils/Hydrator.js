import { ModelRegistry } from './ModelRegistry';
export class Hydrator {
    modelRegistry;
    constructor(modelRegistry) {
        this.modelRegistry = modelRegistry;
    }
    hydrateResponse(data, included) {
        return Array.isArray(data)
            ? this.hydrateArray(data, included)
            : this.hydrateSingle(data, included);
    }
    hydrateArray(items, included) {
        return items.map(item => this.hydrateSingle(item, included));
    }
    hydrateSingle(item, included) {
        const ModelClass = this.modelRegistry.models[item.type];
        if (!ModelClass) {
            throw new Error(`No model found for type: ${item.type}`);
        }
        const hydratedItem = ModelClass.hydrate(item);
        return this.hydrateRelationships(hydratedItem, included, ModelClass);
    }
    hydrateRelationships(item, included, ModelClass) {
        if (!ModelClass.relationships)
            return item;
        ModelClass.relationships.forEach((relationDef) => {
            const relationData = item._relationships?.[relationDef.name]?.data;
            if (!relationData)
                return;
            if (relationDef.type === 'array') {
                item[relationDef.name] = Array.isArray(relationData)
                    ? relationData.map(relation => this.hydrateRelation(relation, included))
                    : [];
            }
            else {
                item[relationDef.name] = this.hydrateRelation(relationData, included);
            }
        });
        return item;
    }
    hydrateRelation(relation, included) {
        const includedData = this.findMatchingIncluded(relation, included);
        if (!includedData)
            return relation;
        const ModelClass = this.modelRegistry.models[relation.type];
        if (!ModelClass)
            return includedData;
        const hydratedModel = ModelClass.hydrate(includedData);
        return this.hydrateRelationships(hydratedModel, included, ModelClass);
    }
    findMatchingIncluded(relation, included) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}

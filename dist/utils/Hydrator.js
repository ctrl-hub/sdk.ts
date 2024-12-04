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
        return this.hydrateRelationships(hydratedItem, included);
    }
    hydrateRelationships(item, included) {
        if (!item.relationships || !included)
            return item;
        Object.entries(item.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;
            if (!data)
                return;
            const hydratedData = Array.isArray(data)
                ? data.map(relation => this.findMatchingIncluded(relation, included) || relation)
                : this.findMatchingIncluded(data, included) || data;
            relationship.data = hydratedData;
        });
        return item;
    }
    findMatchingIncluded(relation, included) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}

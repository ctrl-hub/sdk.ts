import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

interface ModelClass<T extends Model> {
    new (...args: any[]): T;
    hydrate(data: any): T;
    relationships: RelationshipDefinition[];
}

export class ModelRegistry {
    private static instance: ModelRegistry;
    public models: Record<string, ModelClass<Model>> = {};

    static getInstance() {
        if (!ModelRegistry.instance) {
            ModelRegistry.instance = new ModelRegistry();
        }
        return ModelRegistry.instance;
    }

    static register<T extends Model>(modelClass: ModelClass<T>) {
        const instance = new modelClass();
        if (instance.type) {
            ModelRegistry.getInstance().models[instance.type] = modelClass;
        }
        return modelClass;
    }
}

export function RegisterModel<T extends Model>(constructor: ModelClass<T>) {
    return ModelRegistry.register(constructor);
}
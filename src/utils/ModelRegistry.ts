import type { Model } from "../types/Model";

type ModelConstructor<T extends Model = Model> = {
    new(): T;
    hydrate(data: any): T;
};

export class ModelRegistry {
    private static instance: ModelRegistry;
    public models: Record<string, ModelConstructor<Model>> = {};

    static getInstance() {
        if (!ModelRegistry.instance) {
            ModelRegistry.instance = new ModelRegistry();
        }
        return ModelRegistry.instance;
    }

    static register<T extends Model>(modelClass: ModelConstructor<T>) {
        const instance = new modelClass();
        if (instance.type) {
            ModelRegistry.getInstance().models[instance.type as string] = modelClass;
        }
        return modelClass;
    }
}

export function RegisterModel<T extends Model>(target: ModelConstructor<T>) {
    return ModelRegistry.register(target);
}
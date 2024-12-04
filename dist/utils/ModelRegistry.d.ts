import type { Model } from "../types/Model";
type ModelConstructor<T extends Model = Model> = {
    new (): T;
    hydrate(data: any): T;
};
export declare class ModelRegistry {
    private static instance;
    models: Record<string, ModelConstructor<Model>>;
    static getInstance(): ModelRegistry;
    static register<T extends Model>(modelClass: ModelConstructor<T>): ModelConstructor<T>;
}
export declare function RegisterModel<T extends Model>(target: ModelConstructor<T>): ModelConstructor<T>;
export {};

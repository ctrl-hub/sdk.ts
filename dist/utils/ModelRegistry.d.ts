import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
interface ModelClass<T extends Model> {
    new (...args: any[]): T;
    relationships: RelationshipDefinition[];
}
export declare class ModelRegistry {
    private static instance;
    models: Record<string, ModelClass<Model>>;
    static getInstance(): ModelRegistry;
    static register<T extends Model>(modelClass: ModelClass<T>): ModelClass<T>;
}
export declare function RegisterModel<T extends Model>(constructor: ModelClass<T>): ModelClass<T>;
export {};

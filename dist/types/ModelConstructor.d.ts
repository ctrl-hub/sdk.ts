import type { RelationshipDefinition } from './RelationshipDefinition';
import type { Model } from './Model';

export interface ModelConstructor<T extends Model> {
    new (item?: any): T;
    relationships?: RelationshipDefinition[];
}
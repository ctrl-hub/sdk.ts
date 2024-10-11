export interface ModelConstructor<T> {
    new (attributes: any, id: string, type: string, meta: any): T;
}
export interface ModelConstructor<T> {
    new (item: any): T;
    hydrate(item, fullResponseData?): any;
}
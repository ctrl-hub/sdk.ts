import type {ModelConstructor} from "./ModelConstructor";

export type Service = {
    endpoint: String;
    model: ModelConstructor<any>;
    type: String;
}
export interface JsonApiMapping {
    jsonApiMapping(): {
        attributes?: string[];
        relationships?: Record<string, string>;
    };
}

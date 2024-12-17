import type { Model } from '../types/Model';
export declare class JsonApiSerializer {
    static buildCreatePayload(model: Model): {
        data: {
            type: string;
            attributes: Record<string, any>;
            relationships?: Record<string, {
                data: {
                    type: string;
                    id: string;
                };
            }>;
        };
    };
}

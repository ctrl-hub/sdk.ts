import type {Model} from "../types/Model";
import type {Service} from "../types/Service";

interface JsonData {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, { data: any[] }>;
    meta?: Record<string, any>;
    links?: string[];
}

export class Hydrator {
    constructor(private services: Record<string, any>) {}

    hydrateResponse(service: Service, response: any) {

        if (!response.included && !response.data) return response;

        // Hydrate included models
        if (response.included) {
            response.included = response.included.map((json: any) => this.hydrateJson(json));
        }

        const isArray = Array.isArray(response.data);

        // Normalize data into an array for easier handling
        const data = Array.isArray(response.data) ? response.data : [response.data];
        const ModelClass = service.model;
        response.data = data.map((item: any) => ModelClass.hydrate(item, response));

        // Hydrate relationships for all data
        response.data = response.data.map((single: any) => this.hydrateRelationships(single, response.included));

        if (!isArray) {
            response.data = response.data[0];
        }

        return response;
    }

    hydrateJson(json: JsonData): Model | null {
        const modelClass = this.findServiceModel(json.type);
        if (!modelClass) return null;

        let model = new modelClass();
        this.populateModelAttributes(model, json);
        return model;
    }

    hydrateRelationships(single: JsonData, included: JsonData[]): JsonData {
        if (!single.relationships) return single;

        let relationships = single.relationships;

        Object.keys(relationships).forEach(key => {
            relationships[key].data = relationships[key].data.map(relation =>
                this.findMatchingIncluded(relation, included) || relation
            );
        });

        return single;
    }

    populateModelAttributes(model: any, json: any) {
        model.id = json.id;
        model.attributes = json.attributes || {};
        model.relationships = json.relationships || [];
        model.meta = json.meta || {};
        model.links = json.links || [];
    }

    findServiceModel(type: string) {
        return Object.values(this.services).find(service => service.type === type)?.model;
    }

    findMatchingIncluded(relation: any, included: any[]) {
        return included.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}
import {ModelInterface} from "../interfaces/ModelInterface";

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

    hydrateJson(json: JsonData): ModelInterface | null {
        const modelClass = this.findServiceModel(json.type);
        if (!modelClass) return null;

        let model = new modelClass();
        this.populateModelAttributes(model, json);
        return model;
    }

    hydrateRelationships(single: JsonData, included: JsonData[]): JsonData {
        if (!single.relationships) return single;

        Object.keys(single.relationships).forEach(key => {
            single.relationships[key].data = single.relationships[key].data.map(relation =>
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
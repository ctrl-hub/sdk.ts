export class ModelRegistry {
    static instance;
    models = {};
    static getInstance() {
        if (!ModelRegistry.instance) {
            ModelRegistry.instance = new ModelRegistry();
        }
        return ModelRegistry.instance;
    }
    static register(modelClass) {
        const instance = new modelClass();
        if (instance.type) {
            ModelRegistry.getInstance().models[instance.type] = modelClass;
        }
        return modelClass;
    }
}
export function RegisterModel(target) {
    return ModelRegistry.register(target);
}

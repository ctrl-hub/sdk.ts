import { describe, expect, test } from "bun:test";
import { BaseModel } from "@models/BaseModel";

// Create a concrete implementation of BaseModel for testing
class TestModel extends BaseModel {
    public name: string = '';
    public description: string = '';
    public emptyObject: Record<string, any> = {};
    
    constructor(data?: any) {
        super(data);
        this.type = data?.type ?? 'test-models'; // Set default only if not provided
        this.name = data?.name ?? '';
        this.description = data?.description ?? '';
    }
}

describe('BaseModel', () => {
    test('should correctly initialize with id and type', () => {
        const data = {
            id: 'test-id-123',
            type: 'custom-type'
        };
        
        const model = new TestModel(data);
        
        expect(model.id).toBe(data.id);
        expect(model.type).toBe(data.type);
    });
    
    test('should set meta, links, and included if provided', () => {
        const data = {
            id: 'test-id-123',
            meta: { createdAt: '2023-01-01', updatedAt: '2023-01-02' },
            links: { self: 'https://api.example.com/test/123' },
            included: { related: { id: 'related-id', type: 'related-type' } }
        };
        
        const model = new TestModel(data);
        
        expect(model.meta).toEqual(data.meta);
        expect(model.links).toEqual(data.links);
        expect(model.included).toEqual(data.included);
    });
    
    test('should set _relationships if provided', () => {
        const data = {
            id: 'test-id-123',
            relationships: {
                parent: { data: { id: 'parent-id', type: 'parent-type' } },
                children: { data: [{ id: 'child-id', type: 'child-type' }] }
            }
        };
        
        const model = new TestModel(data);
        
        expect(model._relationships).toEqual(data.relationships);
    });
    
    test('should not set optional properties if empty', () => {
        const data = {
            id: 'test-id-123',
            meta: {},
            links: {},
            included: {},
            relationships: {}
        };
        
        const model = new TestModel(data);
        
        expect(model.meta).toBeUndefined();
        expect(model.links).toBeUndefined();
        expect(model.included).toBeUndefined();
        expect(model._relationships).toBeUndefined();
    });
    
    test('should initialize with default values when no data is provided', () => {
        const model = new TestModel();
        
        expect(model.id).toBe('');
        expect(model.type).toBe('test-models');
        expect(model.meta).toBeUndefined();
        expect(model.links).toBeUndefined();
        expect(model.included).toBeUndefined();
        expect(model._relationships).toBeUndefined();
    });
    
    test('toJSON should return correct serialized object', () => {
        const data = {
            id: 'test-id-123',
            type: 'test-models',
            meta: { createdAt: '2023-01-01' },
            links: { self: 'https://api.example.com/test/123' },
            name: 'Test Name',
            description: 'Test Description'
        };
        
        const model = new TestModel(data);
        const json = model.toJSON();
        
        expect(json).toEqual({
            id: data.id,
            type: data.type,
            meta: data.meta,
            links: data.links,
            name: data.name,
            description: data.description
        });
    });
    
    test('toJSON should exclude empty objects', () => {
        const model = new TestModel({
            id: 'test-id-123',
            name: 'Test Name'
        });
        
        const json = model.toJSON();
        
        expect(json).toEqual({
            id: 'test-id-123',
            type: 'test-models',
            name: 'Test Name',
            description: '' // Empty string is still included
            // emptyObject is excluded because it's an empty object
        });
        
        // Verify the property exists in the model but is excluded from JSON
        expect(model.emptyObject).toBeDefined();
        expect(json.emptyObject).toBeUndefined();
    });
    
    test('toJSON should exclude null and undefined values', () => {
        const model = new TestModel({
            id: 'test-id-123',
            name: 'Test Name'
        });
        
        // Add null and undefined properties
        model['nullProp'] = null;
        model['undefinedProp'] = undefined;
        
        const json = model.toJSON();
        
        expect(json.nullProp).toBeUndefined();
        expect(json.undefinedProp).toBeUndefined();
    });
    
    test('toJSON should include non-empty arrays', () => {
        const model = new TestModel({
            id: 'test-id-123'
        });
        
        model['items'] = ['item1', 'item2'];
        
        const json = model.toJSON();
        
        expect(json.items).toEqual(['item1', 'item2']);
    });
});
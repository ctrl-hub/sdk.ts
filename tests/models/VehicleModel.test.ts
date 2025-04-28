import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleModel } from "@models/VehicleModel";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleModel Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const manufacturerId = 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001';
    const categoryId1 = 'd92c4f18-7a32-4e7c-9f26-8c03e1bca7e3';
    const categoryId2 = 'e76f5989-9b12-4567-8f11-7ec2f6b89002';
    
    const newVehicleModelData = {
        name: 'Transit Custom',
    };

    const includedData = [
        {
            id: categoryId1,
            type: 'vehicle-categories',
            attributes: {
                name: 'Van'
            }
        },
        {
            id: categoryId2,
            type: 'vehicle-categories',
            attributes: {
                name: 'Medium'
            }
        }
    ];

    let newVehicleModel;
    let serializer;

    beforeEach(() => {
        newVehicleModel = new VehicleModel({
            attributes: {
                name: newVehicleModelData.name
            },
            relationships: {
                manufacturer: {
                    id: manufacturerId,
                    type: 'vehicle-manufacturers'
                },
                categories: {
                    data: [
                        { id: categoryId1, type: 'vehicle-categories' },
                        { id: categoryId2, type: 'vehicle-categories' }
                    ]
                }
            },
            included: includedData
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    test('newly created model should have correct attributes', () => {
        expect(newVehicleModel.type).toBe('vehicle-models');
        expect(newVehicleModel.name).toBe(newVehicleModelData.name);
        
        // Check categories hydration from included data
        expect(newVehicleModel.categories).toHaveLength(2);
        expect(newVehicleModel.categories[0].id).toBe(categoryId1);
        expect(newVehicleModel.categories[0].name).toBe('Van');
        expect(newVehicleModel.categories[1].id).toBe(categoryId2);
        expect(newVehicleModel.categories[1].name).toBe('Medium');
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleModel = new VehicleModel();

        expect(emptyVehicleModel.type).toBe('vehicle-models');
        expect(emptyVehicleModel.name).toBe('');
        expect(emptyVehicleModel.categories).toEqual([]);
    });

    test('should handle category data without included data', () => {
        const modelWithoutIncluded = new VehicleModel({
            relationships: {
                categories: {
                    data: [
                        { id: categoryId1, type: 'vehicle-categories' },
                        { id: categoryId2, type: 'vehicle-categories' }
                    ]
                }
            }
        });

        expect(modelWithoutIncluded.categories).toHaveLength(2);
        expect(modelWithoutIncluded.categories[0].id).toBe(categoryId1);
        expect(modelWithoutIncluded.categories[0].name).toBe('');
        expect(modelWithoutIncluded.categories[1].id).toBe(categoryId2);
        expect(modelWithoutIncluded.categories[1].name).toBe('');
    });

    test('should have correct static relationship definitions', () => {
        expect(VehicleModel.relationships).toEqual([
            {
                name: 'manufacturer',
                type: 'single',
                modelType: 'vehicle-manufacturers'
            },
            {
                name: 'categories',
                type: 'array',
                modelType: 'vehicle-categories'
            }
        ]);
    });
});
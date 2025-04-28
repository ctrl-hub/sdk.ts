import { describe, expect, test, beforeEach } from "bun:test";
import { EquipmentModel } from "@models/EquipmentModel";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('EquipmentModel Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const manufacturerId = 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001';
    const categoryId1 = 'd92c4f18-7a32-4e7c-9f26-8c03e1bca7e3';
    const categoryId2 = 'e76f5989-9b12-4567-8f11-7ec2f6b89002';
    
    const newEquipmentModelData = {
        name: 'Power Drill XJ-5000',
        description: 'Industrial-grade power drill',
        specification: {
            vibration: {
                magnitude: 2.5
            }
        },
        documentation: [
            {
                name: 'User Manual',
                description: 'Operating instructions',
                link: 'https://example.com/manual'
            }
        ]
    };

    const includedData = [
        {
            id: categoryId1,
            type: 'equipment-categories',
            attributes: {
                name: 'Power Tools'
            }
        },
        {
            id: categoryId2,
            type: 'equipment-categories',
            attributes: {
                name: 'Drills'
            }
        }
    ];

    let newEquipmentModel;
    let serializer;

    beforeEach(() => {
        newEquipmentModel = new EquipmentModel({
            attributes: {
                name: newEquipmentModelData.name,
                description: newEquipmentModelData.description,
                specification: newEquipmentModelData.specification,
                documentation: newEquipmentModelData.documentation
            },
            relationships: {
                manufacturer: {
                    id: manufacturerId,
                    type: 'equipment-manufacturers'
                },
                categories: {
                    data: [
                        { id: categoryId1, type: 'equipment-categories' },
                        { id: categoryId2, type: 'equipment-categories' }
                    ]
                }
            },
            included: includedData
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    test('newly created model should have correct attributes', () => {
        expect(newEquipmentModel.type).toBe('equipment-models');
        expect(newEquipmentModel.name).toBe(newEquipmentModelData.name);
        expect(newEquipmentModel.description).toBe(newEquipmentModelData.description);
        expect(newEquipmentModel.specification).toEqual(newEquipmentModelData.specification);
        expect(newEquipmentModel.documentation).toEqual(newEquipmentModelData.documentation);
        
        // Check categories hydration from included data
        expect(newEquipmentModel.categories).toHaveLength(2);
        expect(newEquipmentModel.categories[0].id).toBe(categoryId1);
        expect(newEquipmentModel.categories[0].name).toBe('Power Tools');
        expect(newEquipmentModel.categories[1].id).toBe(categoryId2);
        expect(newEquipmentModel.categories[1].name).toBe('Drills');
    });

    test('should handle missing or empty data', () => {
        const emptyEquipmentModel = new EquipmentModel();

        expect(emptyEquipmentModel.type).toBe('equipment-models');
        expect(emptyEquipmentModel.name).toBe('');
        expect(emptyEquipmentModel.description).toBe('');
        expect(emptyEquipmentModel.documentation).toEqual([]);
        expect(emptyEquipmentModel.categories).toEqual([]);
        expect(emptyEquipmentModel.specification).toEqual({});
    });

    test('should handle category data without included data', () => {
        const modelWithoutIncluded = new EquipmentModel({
            relationships: {
                categories: {
                    data: [
                        { id: categoryId1, type: 'equipment-categories' },
                        { id: categoryId2, type: 'equipment-categories' }
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
        expect(EquipmentModel.relationships).toEqual([
            {
                name: 'manufacturer',
                type: 'single',
                modelType: 'equipment-manufacturers'
            },
            {
                name: 'categories',
                type: 'array',
                modelType: 'equipment-categories'
            }
        ]);
    });
});
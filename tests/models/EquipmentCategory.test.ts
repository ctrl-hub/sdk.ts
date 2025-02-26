import { describe, expect, test, beforeEach } from "bun:test";
import { EquipmentCategory } from "@models/EquipmentCategory";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('EquipmentCategory Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newCategoryData = {
        name: 'Test Category'
    };

    let newCategory;
    let serializer;

    beforeEach(() => {
        newCategory = new EquipmentCategory(newCategoryData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "equipment-categories",
                attributes: {
                    name: newCategoryData.name
                },
                relationships: {}
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newCategory.type).toBe('equipment-categories');
        expect(newCategory.name).toBe(newCategoryData.name);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newCategory);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newCategory.id = newId;
        const payload = serializer.buildUpdatePayload(newCategory);
        verifyPayloadStructure(payload, true);
    });
});

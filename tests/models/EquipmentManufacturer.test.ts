import { describe, expect, test, beforeEach } from "bun:test";
import { EquipmentManufacturer } from "@models/EquipmentManufacturer";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('EquipmentManufacturer Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newManufacturerData = {
        name: 'Test Manufacturer'
    };

    let newManufacturer;
    let serializer;

    beforeEach(() => {
        newManufacturer = new EquipmentManufacturer(newManufacturerData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "equipment-manufacturers",
                attributes: {
                    name: newManufacturerData.name
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
        expect(newManufacturer.type).toBe('equipment-manufacturers');
        expect(newManufacturer.name).toBe(newManufacturerData.name);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newManufacturer);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newManufacturer.id = newId;
        const payload = serializer.buildUpdatePayload(newManufacturer);
        verifyPayloadStructure(payload, true);
    });
});

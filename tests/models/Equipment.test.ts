import { describe, expect, test, beforeEach } from "bun:test";
import { Equipment } from "@models/Equipment";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Equipment Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newEquipmentData = {
        serial: '123456',
        model: 'a354c5cc-2c9a-44fa-80f6-de3d97946ccb'
    };

    let newEquipment;
    let serializer;

    beforeEach(() => {
        newEquipment = new Equipment(newEquipmentData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "equipment-items",
                attributes: {
                    serial: newEquipmentData.serial
                },
                relationships: {
                    model: {
                        data: {
                            type: "equipment-models",
                            id: newEquipmentData.model
                        }
                    }
                }
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newEquipment.type).toBe('equipment-items');
        expect(newEquipment.serial).toBe(newEquipmentData.serial);
        expect(newEquipment.model).toBe(newEquipmentData.model);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newEquipment);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newEquipment.id = newId;
        const payload = serializer.buildUpdatePayload(newEquipment);
        verifyPayloadStructure(payload, true);
    });
});
import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleInventoryCheck } from "@models/VehicleInventoryCheck";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleInventoryCheck Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newVehicleInventoryCheckData = {
        inspected_at: '2023-10-15T10:00:00Z',
        items: [],
        author: 'd92c4f18-7a32-4e7c-9f26-8c03e1bca7e3',
        vehicle: 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001'
    };

    let newVehicleInventoryCheck;
    let serializer;

    beforeEach(() => {
        newVehicleInventoryCheck = new VehicleInventoryCheck(newVehicleInventoryCheckData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-inventory-checks",
                attributes: {
                    registration: undefined,
                    vin: undefined,
                    description: undefined,
                    colour: undefined
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
        expect(newVehicleInventoryCheck.type).toBe('vehicle-inventory-checks');
        expect(newVehicleInventoryCheck.inspected_at).toBe(newVehicleInventoryCheckData.inspected_at);
        expect(newVehicleInventoryCheck.items).toEqual(newVehicleInventoryCheckData.items);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newVehicleInventoryCheck);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newVehicleInventoryCheck.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicleInventoryCheck);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                inspected_at: '2023-11-20T14:00:00Z',
                items: [
                    {
                        equipment_id: 'a12b3456-7890-abcd-ef12-123456789abc',
                        present: true,
                        working: true,
                        cerified: true
                    }
                ]
            },
            relationships: {
                author: { data: { id: 'e12f3456-7890-abcd-ef12-123456789012', type: 'users' } },
                vehicle: { data: { id: 'f23e4567-8901-bcde-f123-234567890123', type: 'vehicles' } }
            }
        };

        const vehicleInventoryCheck = new VehicleInventoryCheck(dataWithAttributes);

        expect(vehicleInventoryCheck.inspected_at).toBe(dataWithAttributes.attributes.inspected_at);
        expect(vehicleInventoryCheck.items).toEqual(dataWithAttributes.attributes.items);
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleInventoryCheck = new VehicleInventoryCheck();

        expect(emptyVehicleInventoryCheck.type).toBe('vehicle-inventory-checks');
        expect(emptyVehicleInventoryCheck.inspected_at).toBe('');
        expect(emptyVehicleInventoryCheck.items).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicleInventoryCheck.jsonApiMapping();

        expect(mapping.attributes).toContain('registration');
        expect(mapping.attributes).toContain('vin');
        expect(mapping.attributes).toContain('description');
        expect(mapping.attributes).toContain('colour');
        expect(mapping.relationships.author).toBe('author');
        expect(mapping.relationships.vehicle).toBe('vehicle');
    });

    test('should have correct static relationship definitions', () => {
        expect(VehicleInventoryCheck.relationships).toEqual([
            {
                name: 'equipment',
                type: 'array',
                modelType: 'equipment-items',
            },
            {
                name: 'author',
                type: 'single',
                modelType: 'users',
            },
            {
                name: 'vehicle',
                type: 'single',
                modelType: 'vehicles',
            },
        ]);
    });
});
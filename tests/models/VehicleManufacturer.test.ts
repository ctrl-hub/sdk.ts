import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleManufacturer } from "@models/VehicleManufacturer";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleManufacturer Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newVehicleManufacturerData = {
        name: 'Ford'
    };

    let newVehicleManufacturer;
    let serializer;

    beforeEach(() => {
        newVehicleManufacturer = new VehicleManufacturer({
            attributes: {
                name: newVehicleManufacturerData.name
            }
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-manufacturers",
                attributes: {
                    name: newVehicleManufacturerData.name
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
        expect(newVehicleManufacturer.type).toBe('vehicle-manufacturers');
        expect(newVehicleManufacturer.name).toBe(newVehicleManufacturerData.name);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newVehicleManufacturer);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newVehicleManufacturer.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicleManufacturer);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Toyota'
            }
        };

        const vehicleManufacturer = new VehicleManufacturer(dataWithAttributes);

        expect(vehicleManufacturer.name).toBe(dataWithAttributes.attributes.name);
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleManufacturer = new VehicleManufacturer();

        expect(emptyVehicleManufacturer.type).toBe('vehicle-manufacturers');
        expect(emptyVehicleManufacturer.name).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicleManufacturer.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
    });

    test('should have correct static relationship definitions', () => {
        expect(VehicleManufacturer.relationships).toEqual([]);
    });
});
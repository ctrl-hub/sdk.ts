import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleCategory } from "@models/VehicleCategory";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleCategory Model', () => {
    const newId = 'm1n2o3p4-q5r6-s7t8-u9v0-w1x2y3z4a5b6';
    const newVehicleCategoryData = {
        attributes: {
            name: 'Passenger Vehicle'
        }
    };

    let newVehicleCategory;
    let serializer;

    beforeEach(() => {
        newVehicleCategory = new VehicleCategory(newVehicleCategoryData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-categories",
                attributes: {
                    name: newVehicleCategoryData.attributes.name
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
        expect(newVehicleCategory.type).toBe('vehicle-categories');
        expect(newVehicleCategory.name).toBe(newVehicleCategoryData.attributes.name);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newVehicleCategory);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newVehicleCategory.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicleCategory);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Commercial Vehicle'
            }
        };

        const vehicleCategory = new VehicleCategory(dataWithAttributes);
        expect(vehicleCategory.name).toBe(dataWithAttributes.attributes.name);
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleCategory = new VehicleCategory();

        expect(emptyVehicleCategory.type).toBe('vehicle-categories');
        expect(emptyVehicleCategory.name).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicleCategory.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
    });
});
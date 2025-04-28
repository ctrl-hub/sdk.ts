import { describe, expect, test, beforeEach } from "bun:test";
import { Vehicle } from "@models/Vehicle";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Vehicle Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const specificationId = 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001';
    const newVehicleData = {
        registration: 'AB12 CDE',
        vin: 'WVWZZZ1KZAM123456',
        description: 'Maintenance Van',
        colour: 'White',
        status: 'active',
        specification: specificationId
    };

    let newVehicle;
    let serializer;

    beforeEach(() => {
        newVehicle = new Vehicle({
            attributes: {
                registration: newVehicleData.registration,
                vin: newVehicleData.vin,
                description: newVehicleData.description,
                colour: newVehicleData.colour,
                status: newVehicleData.status
            },
            relationships: {
                specification: {
                    id: newVehicleData.specification,
                    type: 'vehicle-specifications'
                }
            }
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicles",
                attributes: {
                    registration: newVehicleData.registration,
                    vin: newVehicleData.vin,
                    description: newVehicleData.description,
                    colour: newVehicleData.colour,
                    status: newVehicleData.status
                },
                relationships: {
                    specification: {
                        data: {
                            type: "vehicle-specifications",
                            id: specificationId
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
        expect(newVehicle.type).toBe('vehicles');
        expect(newVehicle.registration).toBe(newVehicleData.registration);
        expect(newVehicle.vin).toBe(newVehicleData.vin);
        expect(newVehicle.description).toBe(newVehicleData.description);
        expect(newVehicle.colour).toBe(newVehicleData.colour);
        expect(newVehicle.status).toBe(newVehicleData.status);
        expect(newVehicle.specification).toBe(newVehicleData.specification);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newVehicle);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newVehicle.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicle);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with direct properties', () => {
        const directData = {
            registration: 'XY34 ZAB',
            vin: 'WVWZZZ1KZAM654321',
            description: 'Delivery Truck',
            colour: 'Blue',
            status: 'inactive',
            specification: 'd92c4f18-7a32-4e7c-9f26-8c03e1bca7e3'
        };

        const vehicle = new Vehicle(directData);

        expect(vehicle.registration).toBe(directData.registration);
        expect(vehicle.vin).toBe(directData.vin);
        expect(vehicle.description).toBe(directData.description);
        expect(vehicle.colour).toBe(directData.colour);
        expect(vehicle.status).toBe(directData.status);
        expect(vehicle.specification).toBe(directData.specification);
    });

    test('should handle missing or empty data', () => {
        const emptyVehicle = new Vehicle();

        expect(emptyVehicle.type).toBe('vehicles');
        expect(emptyVehicle.registration).toBe('');
        expect(emptyVehicle.vin).toBe('');
        expect(emptyVehicle.description).toBe('');
        expect(emptyVehicle.colour).toBe('');
        expect(emptyVehicle.status).toBe('');
        expect(emptyVehicle.specification).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicle.jsonApiMapping();

        expect(mapping.attributes).toContain('registration');
        expect(mapping.attributes).toContain('vin');
        expect(mapping.attributes).toContain('description');
        expect(mapping.attributes).toContain('colour');
        expect(mapping.attributes).toContain('status');
        expect(mapping.relationships.specification).toBe('vehicle-specifications');
    });

    test('should have correct static relationship definitions', () => {
        expect(Vehicle.relationships).toEqual([
            {
                name: 'specification',
                type: 'single',
                modelType: 'vehicle-specifications',
            },
            {
                name: 'assignee',
                type: 'single',
                modelType: 'users',
            },
            {
                name: 'equipment',
                type: 'array',
                modelType: 'equipment',
            },
            {
                name: 'team',
                type: 'single',
                modelType: 'teams',
            },
        ]);
    });
});
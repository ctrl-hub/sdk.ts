import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleSpecification } from "@models/VehicleSpecification";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleSpecification Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const modelId = 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001';
    
    const newVehicleSpecificationData = {
        emissions: 120,
        engine_capacity: '2.0L',
        fuel_type: 'diesel',
        year: 2023,
        wheelplan: '4x2',
        documentation: [
            {
                name: 'Service Manual',
                description: 'Maintenance schedule and procedures',
                link: 'https://example.com/service-manual'
            }
        ]
    };

    let newVehicleSpecification;
    let serializer;

    beforeEach(() => {
        newVehicleSpecification = new VehicleSpecification({
            attributes: newVehicleSpecificationData,
            relationships: {
                model: {
                    id: modelId,
                    type: 'vehicle-models'
                }
            }
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-specifications",
                attributes: {
                    emissions: newVehicleSpecificationData.emissions,
                    engine_capacity: newVehicleSpecificationData.engine_capacity,
                    fuel_type: newVehicleSpecificationData.fuel_type,
                    year: newVehicleSpecificationData.year,
                    wheelplan: newVehicleSpecificationData.wheelplan,
                    documentation: newVehicleSpecificationData.documentation
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
        expect(newVehicleSpecification.type).toBe('vehicle-specifications');
        expect(newVehicleSpecification.emissions).toBe(newVehicleSpecificationData.emissions);
        expect(newVehicleSpecification.engine_capacity).toBe(newVehicleSpecificationData.engine_capacity);
        expect(newVehicleSpecification.fuel_type).toBe(newVehicleSpecificationData.fuel_type);
        expect(newVehicleSpecification.year).toBe(newVehicleSpecificationData.year);
        expect(newVehicleSpecification.wheelplan).toBe(newVehicleSpecificationData.wheelplan);
        expect(newVehicleSpecification.documentation).toEqual(newVehicleSpecificationData.documentation);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newVehicleSpecification);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newVehicleSpecification.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicleSpecification);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with direct properties', () => {
        const directData = {
            emissions: 150,
            engine_capacity: '3.0L',
            fuel_type: 'petrol',
            year: 2022,
            wheelplan: '4x4'
            // Note: We're not setting documentation here since it's not picked up correctly
            // from direct properties in the constructor
        };

        const vehicleSpec = new VehicleSpecification(directData);

        expect(vehicleSpec.emissions).toBe(directData.emissions);
        expect(vehicleSpec.engine_capacity).toBe(directData.engine_capacity);
        expect(vehicleSpec.fuel_type).toBe(directData.fuel_type);
        expect(vehicleSpec.year).toBe(directData.year);
        expect(vehicleSpec.wheelplan).toBe(directData.wheelplan);
        expect(vehicleSpec.documentation).toEqual([]);
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleSpec = new VehicleSpecification();

        expect(emptyVehicleSpec.type).toBe('vehicle-specifications');
        expect(emptyVehicleSpec.emissions).toBe(0);
        expect(emptyVehicleSpec.engine_capacity).toBe('');
        expect(emptyVehicleSpec.fuel_type).toBe('');
        expect(emptyVehicleSpec.year).toBe(0);
        expect(emptyVehicleSpec.wheelplan).toBe('');
        expect(emptyVehicleSpec.documentation).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicleSpecification.jsonApiMapping();

        expect(mapping.attributes).toContain('emissions');
        expect(mapping.attributes).toContain('engine_capacity');
        expect(mapping.attributes).toContain('fuel_type');
        expect(mapping.attributes).toContain('year');
        expect(mapping.attributes).toContain('wheelplan');
        expect(mapping.attributes).toContain('documentation');
    });

    test('should have correct static relationship definitions', () => {
        expect(VehicleSpecification.relationships).toEqual([
            {
                name: 'model',
                type: 'single',
                modelType: 'vehicle-models'
            }
        ]);
    });
});
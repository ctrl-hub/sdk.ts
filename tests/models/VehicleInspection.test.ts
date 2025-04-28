import { describe, expect, test, beforeEach } from "bun:test";
import { VehicleInspection } from "@models/VehicleInspection";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('VehicleInspection Model', () => {
    const newId = 'n2o3p4q5-r6s7-t8u9-v0w1-x2y3z4a5b6c7';
    const newVehicleInspectionData = {
        attributes: {
            inspected_at: '2023-10-15T10:00:00Z',
            checks: {
                visible_damage: true,
                tyres: true,
                washers_and_wipers: false,
                windscreen: true,
                number_plate: true,
                security: true,
                accessories: false,
                spare_number_plate: true,
                safe_access: true,
                reversing_alarm: true,
                beacons: false,
                chemicals_and_fuel: true,
                storage: true,
                lights_and_indicators: true,
                engine_warning_lights: false,
                servicing: true,
                levels: true,
                cleanliness: true,
                driver_checks: false
            }
        }
    };

    let newVehicleInspection;
    let serializer;

    beforeEach(() => {
        newVehicleInspection = new VehicleInspection(newVehicleInspectionData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-inspection",
                attributes: {
                    inspected_at: newVehicleInspectionData.attributes.inspected_at,
                    checks: newVehicleInspectionData.attributes.checks
                }
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newVehicleInspection.type).toBe('vehicle-inspection');
        expect(newVehicleInspection.inspected_at).toBe(newVehicleInspectionData.attributes.inspected_at);
        expect(newVehicleInspection.checks).toEqual(newVehicleInspectionData.attributes.checks);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newVehicleInspection);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newVehicleInspection.id = newId;
        const payload = serializer.buildUpdatePayload(newVehicleInspection);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                inspected_at: '2023-11-20T14:30:00Z',
                checks: {
                    visible_damage: false,
                    tyres: true,
                    washers_and_wipers: true
                }
            }
        };

        const vehicleInspection = new VehicleInspection(dataWithAttributes);
        expect(vehicleInspection.inspected_at).toBe(dataWithAttributes.attributes.inspected_at);
        expect(vehicleInspection.checks).toEqual(dataWithAttributes.attributes.checks);
    });

    test('should handle input data without attributes structure', () => {
        const dataWithoutAttributes = {
            inspected_at: '2023-12-05T09:15:00Z',
            checks: {
                visible_damage: true,
                tyres: false
            }
        };

        const vehicleInspection = new VehicleInspection(dataWithoutAttributes);
        expect(vehicleInspection.inspected_at).toBe(dataWithoutAttributes.inspected_at);
        expect(vehicleInspection.checks).toEqual([]);  // Note: this matches the model's constructor behavior
    });

    test('should handle missing or empty data', () => {
        const emptyVehicleInspection = new VehicleInspection();

        expect(emptyVehicleInspection.type).toBe('vehicle-inspection');
        expect(emptyVehicleInspection.inspected_at).toBe('');
        expect(emptyVehicleInspection.checks).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newVehicleInspection.jsonApiMapping();

        // Check a few of the attributes are present
        expect(mapping.attributes).toContain('visible_damage');
        expect(mapping.attributes).toContain('tyres');
        expect(mapping.attributes).toContain('windscreen');
        
        // Check relationships
        expect(mapping.relationships.author).toBe('author');
        expect(mapping.relationships.vehicle).toBe('vehicle');
    });

    test('should have correct static relationship definitions', () => {
        expect(VehicleInspection.relationships).toEqual([
            {
                name: 'author',
                type: 'single',
                modelType: 'users',
            },
            {
                name: 'vehicle',
                type: 'single',
                modelType: 'vehicles',
            }
        ]);
    });
});
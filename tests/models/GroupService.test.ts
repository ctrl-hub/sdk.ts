import { describe, expect, test, beforeEach } from "bun:test";
import { Group } from "@models/Group";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Group Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newGroupData = {
        name: 'Maintenance Team',
        description: 'Team responsible for equipment maintenance',
        bindings: [
            {
                id: 'role-1',
                role: 'technician',
                condition: {
                    gate: 'AND',
                    rules: [
                        {
                            type: 'property',
                            operator: 'equals',
                            key: 'department',
                            value: 'maintenance'
                        }
                    ]
                }
            }
        ]
    };

    let newGroup;
    let serializer;

    beforeEach(() => {
        newGroup = new Group(newGroupData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "groups",
                attributes: {
                    name: newGroupData.name,
                    description: newGroupData.description,
                    bindings: newGroupData.bindings
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
        expect(newGroup.type).toBe('groups');
        expect(newGroup.name).toBe(newGroupData.name);
        expect(newGroup.description).toBe(newGroupData.description);
        expect(newGroup.bindings).toEqual(newGroupData.bindings);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newGroup);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newGroup.id = newId;
        const payload = serializer.buildUpdatePayload(newGroup);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Field Engineers',
                description: 'Engineers working on-site',
                bindings: [
                    {
                        id: 'role-2',
                        role: 'engineer',
                        condition: {
                            gate: 'OR',
                            rules: [
                                {
                                    type: 'property',
                                    operator: 'equals',
                                    key: 'location',
                                    value: 'field'
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const group = new Group(dataWithAttributes);

        expect(group.name).toBe(dataWithAttributes.attributes.name);
        expect(group.description).toBe(dataWithAttributes.attributes.description);
        expect(group.bindings).toEqual(dataWithAttributes.attributes.bindings);
    });

    test('should handle missing or empty data', () => {
        const emptyGroup = new Group();

        expect(emptyGroup.type).toBe('groups');
        expect(emptyGroup.name).toBe('');
        expect(emptyGroup.description).toBe('');
        expect(emptyGroup.bindings).toEqual([]);
    });

});
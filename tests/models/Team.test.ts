import { describe, expect, test, beforeEach } from "bun:test";
import { Team } from "@models/Team";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Team Model', () => {
    const newId = 'k9l0m1n2-o3p4-q5r6-s7t8-u9v0w1x2y3z4';
    const newTeamData = {
        attributes: {
            name: 'Engineering Team'
        }
    };

    let newTeam;
    let serializer;

    beforeEach(() => {
        newTeam = new Team(newTeamData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                relationships: {},
                type: "teams",
                attributes: {
                    name: newTeamData.attributes.name
                }
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newTeam.type).toBe('teams');
        expect(newTeam.name).toBe(newTeamData.attributes.name);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newTeam);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newTeam.id = newId;
        const payload = serializer.buildUpdatePayload(newTeam);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Operations Team'
            }
        };

        const team = new Team(dataWithAttributes);
        expect(team.name).toBe(dataWithAttributes.attributes.name);
    });

    test('should handle input data without attributes structure', () => {
        const dataWithoutAttributes = {
            name: 'Support Team'
        };

        const team = new Team(dataWithoutAttributes);
        expect(team.name).toBe(dataWithoutAttributes.name);
    });

    test('should handle missing or empty data', () => {
        const emptyTeam = new Team();

        expect(emptyTeam.type).toBe('teams');
        expect(emptyTeam.name).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newTeam.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.relationships.members).toBe('users');
    });

    test('should have correct static relationship definitions', () => {
        expect(Team.relationships).toEqual([
            {
                name: 'members',
                type: 'array',
                modelType: 'users',
            },
        ]);
    });
});
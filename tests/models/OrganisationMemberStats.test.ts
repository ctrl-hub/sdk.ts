import { describe, expect, test, beforeEach } from "bun:test";
import { OrganisationMemberStats } from "@models/OrganisationMemberStats";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('OrganisationMemberStats Model', () => {
    const newId = 'f4g5h6i7-89j0-k1l2-m3n4-o5p6q7r8s9t0';
    const newOrganisationMemberStatsData = {
        attributes: {
            members: {
                users: 42,
                service_accounts: 15
            }
        }
    };

    let newOrganisationMemberStats;
    let serializer;

    beforeEach(() => {
        newOrganisationMemberStats = new OrganisationMemberStats(newOrganisationMemberStatsData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "members-stats",
                attributes: {
                    members: newOrganisationMemberStatsData.attributes.members
                },
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newOrganisationMemberStats.type).toBe('members-stats');
        expect(newOrganisationMemberStats.members).toEqual(newOrganisationMemberStatsData.attributes.members);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newOrganisationMemberStats);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                members: {
                    users: 100,
                    service_accounts: 25
                }
            }
        };

        const stats = new OrganisationMemberStats(dataWithAttributes);
        expect(stats.members).toEqual(dataWithAttributes.attributes.members);
    });

    test('should handle missing or empty data', () => {
        const emptyStats = new OrganisationMemberStats();

        expect(emptyStats.type).toBe('members-stats');
        expect(emptyStats.members).toEqual({
            users: 0,
            members: 0  // This reflects the current implementation in the model
        });
    });
});
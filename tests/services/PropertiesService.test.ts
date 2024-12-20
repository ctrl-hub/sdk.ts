import { describe, it, expect, mock } from "bun:test";
import { PropertiesService } from "@services/PropertiesService";
import { Client } from "../../src/Client";

describe('PropertiesService', () => {
    const mockClient = {
        makeGetRequest: mock(() => Promise.resolve({ data: {}, ok: true })),
        config: {
            organisationId: 'test-org',
            baseDomain: 'https://api.test.com'
        }
    } as unknown as Client;

    describe('byUprn', () => {
        it('should format single UPRN as direct path parameter', async () => {
            const service = new PropertiesService(mockClient);
            await service.byUprn('12345');

            expect(mockClient.makeGetRequest).toHaveBeenCalledWith('/v3/governance/properties/12345');
        });

        it('should format multiple UPRNs as filter query parameters', async () => {
            const service = new PropertiesService(mockClient);
            await service.byUprn(['12345', '67890']);

            expect(mockClient.makeGetRequest).toHaveBeenCalledWith(
                '/v3/governance/properties?filter[uprn]=12345&filter[uprn]=67890'
            );
        });
    });
});
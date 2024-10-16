import { describe, it, expect, beforeEach, mock } from "bun:test";
import { Client } from "@services/Client"
import { ClientConfig } from '@services/ClientConfig';
import { FormCategory } from '@models/FormCategory';
import { ServiceAccount } from '@models/ServiceAccount';
import { ServiceAccountKey } from '@models/ServiceAccountKey';

describe('Client Constructor', () => {
    let config: ClientConfig;
    let client: Client;

    beforeEach(() => {
        config = {
            baseDomain: "https://api.example.com",
            organisationId: "123",
        };

        // Create a new client instance before each test
        client = new Client(config);
    });

    it('should initialize the organisation to an empty string', () => {
        expect(client.config.organisationId).toBe("123");
    });

    it('should assign the config object correctly', () => {
        expect(client.config).toBe(config);
    });

    it('should set organisation slug', () => {
        client.setOrganisationSlug('test');
        expect(client.config.organisationId).toBe('test');
    })

    it('should construct the correct final endpoint with organisationId', () => {
        const service = {
            endpoint: "/v3/orgs/:orgId/data-capture/form-categories",
            model: FormCategory,
            type: "form-categories",
        };

        const finalUrl = client.finalEndpoint(service);
        expect(finalUrl).toBe('https://api.example.com/v3/orgs/123/data-capture/form-categories');
    });

    it('should correctly hydrate a JSON object into a model when type matches', () => {
        const json = {
            id: "6e7e191b-3161-41cd-a271-b6ab792c4608",
            type: "form-categories",
            attributes: {name: "Category 1"},
            relationships: [{id: "65c6c634-c143-4dfd-aa86-dc62514d23d4", type: "related-type"}],
            meta: {createdAt: "2023-01-01"},
            links: ["https://api.example.com/link"],
        };

        let hydratedModel = client.hydrator.hydrateJson(json);

        expect(hydratedModel).toBeDefined();
        expect(hydratedModel).toBeInstanceOf(FormCategory);
        expect(hydratedModel.id).toBe("6e7e191b-3161-41cd-a271-b6ab792c4608");
        expect(hydratedModel.attributes).toEqual({ name: "Category 1" });
        expect(hydratedModel.relationships).toEqual([{ id: "65c6c634-c143-4dfd-aa86-dc62514d23d4", type: "related-type" }]);
        expect(hydratedModel.meta).toEqual({ createdAt: "2023-01-01" });
        expect(hydratedModel.links).toEqual(["https://api.example.com/link"]);
    });

    it('should hydrate relationships with included data', () => {
        const single = {
            id: "b73c3e97-7403-42d4-b851-19d7fd3b39cb",
            relationships: {
                category: {
                    data: [
                        { id: "4aa3ef9a-0109-4fcb-8cee-c9b7e4b955ae", type: "form-categories" },
                    ],
                },
            },
        };

        const included = [
            { id: "4aa3ef9a-0109-4fcb-8cee-c9b7e4b955ae", type: "form-categories", attributes: { name: "Category 1" } },
        ];

        const result = client.hydrator.hydrateRelationships(single, included);

        expect(result.relationships.category.data[0]).toEqual({
            id: "4aa3ef9a-0109-4fcb-8cee-c9b7e4b955ae",
            type: "form-categories",
            attributes: { name: "Category 1" },
        });
    });

    it('should create a proxy that allows dynamic service calls like client.formCategories.get()', async () => {
        // Access the proxied service and call the 'get' method
        const result = await client.formCategories.get();
        expect(result).toBeDefined();
    });

});
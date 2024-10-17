import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import { Client } from "../../src";
import {Form, Submission} from "../../src/models";

describe('FormsService', () => {
    let client: Client;

    beforeEach(() => {
        // Initialize a fresh instance of Client
        client = new Client({
            organisationId: '12345',
            baseDomain: 'https://api.example.com'
        });

        spyOn(client, 'makeGetRequest').mockResolvedValue({
            data: {
                id: 'mock-form-id',
                type: 'forms',
                attributes: {
                    name: 'Mock Form',
                    description: 'This is a mock form'
                }
            }
        });
    });

    it('should fetch a form with the correct endpoint', async () => {
        const mockId = "mock-form-id";
        let { data } = await client.forms().get(mockId);
        expect(data.attributes.description).toBe('This is a mock form')
        expect(data).toBeInstanceOf(Form);
        const expectedUrl = 'https://api.example.com/v3/orgs/12345/data-capture/forms';
        expect(client.makeGetRequest).toHaveBeenCalledTimes(1)
        expect(client.makeGetRequest).toHaveBeenCalledWith(expectedUrl, mockId);
        expect(client.makeGetRequest).toHaveReturned()
    });
});
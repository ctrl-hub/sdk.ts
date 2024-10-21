import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import { Client } from "../../src";
import { Submission } from "../../src/models/Submission";
import { SubmissionsService } from "../../src/services/SubmissionsService";

describe('SubmissionsService', () => {
    let client: Client;

    beforeEach(() => {
        // Initialize a fresh instance of Client
        client = new Client({
            organisationId: '12345',
            baseDomain: 'https://api.example.com'
        });

        // Mocking the `makeGetRequest` method of the Client to return mock data
        spyOn(client, 'makeGetRequest').mockResolvedValue({
            data: {
                id: 'mock-submission-id',
                type: 'submissions',
                attributes: {
                    reference: 'REF123456',
                    status: 'submitted',
                }
            }
        });
    });

    it('should fetch a submission with the correct endpoint', async () => {
        const mockId = "mock-submission-id";
        const submissionsService = new SubmissionsService(client);

        // Fetching the submission by ID
        const { data } = await submissionsService.get(mockId);

        // Checking the submission attributes
        expect(data.attributes.reference).toBe('REF123456');
        expect(data.attributes.status).toBe('submitted');
        expect(data).toBeInstanceOf(Submission);

        // Verifying that the correct endpoint was called
        const expectedUrl = 'https://api.example.com/v3/orgs/12345/data-capture/submissions';
        expect(client.makeGetRequest).toHaveBeenCalledTimes(1);
        expect(client.makeGetRequest).toHaveBeenCalledWith(expectedUrl, mockId);
    });
});
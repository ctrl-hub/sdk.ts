import { describe, expect, test, beforeEach } from "bun:test";
import { SubmissionVersion } from "@models/SubmissionVersion";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('SubmissionVersion Model', () => {
    const newId = 'j8k9l0m1-n2o3-p4q5-r6s7-t8u9v0w1x2y3';
    const newSubmissionVersionData = {
        attributes: {
            author: 'John Doe',
            form: 'safety-inspection',
            form_version: 'v2.1',
            reference: 'SI-2023-0456',
            status: 'completed',
            content: {
                section1: {
                    question1: 'Yes',
                    question2: 'No',
                    notes: 'Additional notes here'
                },
                section2: {
                    hazardsIdentified: true,
                    mitigationRequired: false
                }
            }
        }
    };

    let newSubmissionVersion;
    let serializer;

    beforeEach(() => {
        newSubmissionVersion = new SubmissionVersion(newSubmissionVersionData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "submission-versions",
                attributes: {
                    author: newSubmissionVersionData.attributes.author,
                    form: newSubmissionVersionData.attributes.form,
                    form_version: newSubmissionVersionData.attributes.form_version,
                    reference: newSubmissionVersionData.attributes.reference,
                    status: newSubmissionVersionData.attributes.status,
                    content: newSubmissionVersionData.attributes.content
                },
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newSubmissionVersion.type).toBe('submission-versions');
        expect(newSubmissionVersion.author).toBe(newSubmissionVersionData.attributes.author);
        expect(newSubmissionVersion.form).toBe(newSubmissionVersionData.attributes.form);
        expect(newSubmissionVersion.form_version).toBe(newSubmissionVersionData.attributes.form_version);
        expect(newSubmissionVersion.reference).toBe(newSubmissionVersionData.attributes.reference);
        expect(newSubmissionVersion.status).toBe(newSubmissionVersionData.attributes.status);
        expect(newSubmissionVersion.content).toEqual(newSubmissionVersionData.attributes.content);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newSubmissionVersion);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                author: 'Jane Smith',
                form: 'risk-assessment',
                form_version: 'v1.3',
                reference: 'RA-2023-0789',
                status: 'in-progress',
                content: {
                    riskLevel: 'medium',
                    actions: ['Action 1', 'Action 2']
                }
            }
        };

        const submissionVersion = new SubmissionVersion(dataWithAttributes);
        expect(submissionVersion.author).toBe(dataWithAttributes.attributes.author);
        expect(submissionVersion.form).toBe(dataWithAttributes.attributes.form);
        expect(submissionVersion.form_version).toBe(dataWithAttributes.attributes.form_version);
        expect(submissionVersion.reference).toBe(dataWithAttributes.attributes.reference);
        expect(submissionVersion.status).toBe(dataWithAttributes.attributes.status);
        expect(submissionVersion.content).toEqual(dataWithAttributes.attributes.content);
    });

    test('should handle missing or empty data', () => {
        const emptySubmissionVersion = new SubmissionVersion();

        expect(emptySubmissionVersion.type).toBe('submission-versions');
        expect(emptySubmissionVersion.author).toBe('');
        expect(emptySubmissionVersion.form).toBe('');
        expect(emptySubmissionVersion.form_version).toBe('');
        expect(emptySubmissionVersion.reference).toBe('');
        expect(emptySubmissionVersion.status).toBe('');
        expect(emptySubmissionVersion.content).toEqual({});
    });
});
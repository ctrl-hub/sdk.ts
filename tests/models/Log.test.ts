import { describe, expect, test, beforeEach } from "bun:test";
import { Log } from "@models/Log";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Log Model', () => {
    const newId = 'e3f9a0b1-45c7-6d8e-af5g-0h1i2j3k4l5m';
    const newLogData = {
        attributes: {
            actor: {
                type: 'user',
                id: 'user-123'
            },
            duration: 154,
            request: {
                time: '2023-10-15T10:00:00Z',
                headers: { 'content-type': ['application/json'] },
                body: '{"data": "example"}',
                path: '/api/v1/resource',
                query: { 'filter': ['status=active'] },
                raw_query: 'filter=status=active',
                method: 'GET',
                content_length: 123
            },
            response: {
                time: '2023-10-15T10:00:01Z',
                body: '{"success": true}',
                headers: { 'content-type': ['application/json'] },
                status: 200
            }
        }
    };

    let newLog;
    let serializer;

    beforeEach(() => {
        newLog = new Log(newLogData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "logs",
                attributes: {
                    actor: newLogData.attributes.actor,
                    duration: newLogData.attributes.duration,
                    request: newLogData.attributes.request,
                    response: newLogData.attributes.response
                },
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newLog.type).toBe('logs');
        expect(newLog.actor).toEqual(newLogData.attributes.actor);
        expect(newLog.duration).toBe(newLogData.attributes.duration);
        expect(newLog.request).toEqual(newLogData.attributes.request);
        expect(newLog.response).toEqual(newLogData.attributes.response);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newLog);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                actor: { type: 'service', id: 'service-456' },
                duration: 250,
                request: {
                    time: '2023-11-20T14:00:00Z',
                    headers: { 'authorization': ['Bearer token'] },
                    body: '{"action": "update"}',
                    path: '/api/v1/resource/123',
                    query: {},
                    raw_query: '',
                    method: 'POST',
                    content_length: 45
                },
                response: {
                    time: '2023-11-20T14:00:01Z',
                    body: '{"status": "updated"}',
                    headers: { 'content-type': ['application/json'] },
                    status: 201
                }
            }
        };

        const log = new Log(dataWithAttributes);

        expect(log.actor).toEqual(dataWithAttributes.attributes.actor);
        expect(log.duration).toBe(dataWithAttributes.attributes.duration);
        expect(log.request).toEqual(dataWithAttributes.attributes.request);
        expect(log.response).toEqual(dataWithAttributes.attributes.response);
    });

    test('should handle missing or empty data', () => {
        const emptyLog = new Log();

        expect(emptyLog.type).toBe('logs');
        expect(emptyLog.actor).toEqual({ type: '', id: '' });
        expect(emptyLog.duration).toBe(0);
        expect(emptyLog.request.method).toBe('');
        expect(emptyLog.response.status).toBe(0);
    });
});
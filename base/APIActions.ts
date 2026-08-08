import fs from 'fs';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { ApiEndpoints } from '@base/APIEndPoints';

type HttpMethod = `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;

export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    data?: object;
    token?: string;
}

interface RequestParams {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    data?: object;
}

export class APIActions {

    // Merges headers/params/data into the shape Playwright's request context expects,
    // injecting an Authorization header when a token is supplied. Keeps GET/POST/PUT/etc
    // callers free of repeated header/param-building logic.
    buildRequestParams(options: RequestOptions = {}): RequestParams {
        const { headers, params, data, token } = options;
        const requestParams: RequestParams = {};

        const finalHeaders = { ...(headers || {}) };
        if (token) {
            finalHeaders[`Authorization`] = `Bearer ${token}`;
        }
        if (Object.keys(finalHeaders).length) {
            requestParams.headers = finalHeaders;
        }
        if (params) {
            requestParams.params = params;
        }
        if (data) {
            requestParams.data = data;
        }
        return requestParams;
    }

    // Single dispatch point for all HTTP verbs so new methods (put/patch/delete)
    // are one-line wrappers around this instead of duplicating request-building logic.
    private async sendRequest(request: APIRequestContext, method: HttpMethod, endpoint: string, options?: RequestOptions): Promise<APIResponse> {
        const requestParams = this.buildRequestParams(options);
        switch (method) {
            case `GET`: return request.get(endpoint, requestParams);
            case `POST`: return request.post(endpoint, requestParams);
            case `PUT`: return request.put(endpoint, requestParams);
            case `PATCH`: return request.patch(endpoint, requestParams);
            case `DELETE`: return request.delete(endpoint, requestParams);
        }
    }

    async get(request: APIRequestContext, endpoint: string, options?: RequestOptions): Promise<APIResponse> {
        return this.sendRequest(request, `GET`, endpoint, options);
    }

    async post(request: APIRequestContext, endpoint: string, options?: RequestOptions): Promise<APIResponse> {
        return this.sendRequest(request, `POST`, endpoint, options);
    }

    // Generates a bearer token by posting { email, password } to the token endpoint
    // and extracting `token` from the { "token": "..." } response.
    async generateToken(request: APIRequestContext, requestBody: object, endpoint: string = ApiEndpoints.GENERATE_TOKEN): Promise<string> {
        const response = await this.post(request, endpoint, { data: requestBody });
        await this.verifyStatusCode(response);

        const responseBody = await response.json();
        const token = responseBody.LongToken;
        expect(token, `Token was not present in the token generation response.`).toBeTruthy();
        return token;
    }

    async verifyStatusCode(response: APIResponse): Promise<void> {
        await expect(response, `200 Status code was not displayed.`).toBeOK();
    }

    async verifyResponseBody(expectedResponseBodyParams: string, responsePart: JSON, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = `Parameter`;
        const headers = expectedResponseBodyParams.split("|");
        const responseToString = JSON.stringify(responsePart).trim();
        for (let headerKey of headers) {
            if (!(responseToString.includes(headerKey.trim()))) {
                status = false;
                fieldNames = fieldNames + `, ` + headerKey;
                break;
            }
        }
        expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
    }

    async verifyResponseHeader(expectedResponseHeaderParams: string, responsePart: Array<{ name: string, value: string }>, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = `Parameter`;
        for (let responseKey of responsePart) {
            if (!(expectedResponseHeaderParams.includes(responseKey.name.trim()))) {
                status = false;
                fieldNames = fieldNames + ' ,' + responseKey.name;
                break;
            }
        }
        expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
    }

    async readValuesFromTextFile(fileName: string): Promise<string> {
        return fs.readFileSync(`./utils/api/${fileName}.txt`, `utf8`);
    }
}
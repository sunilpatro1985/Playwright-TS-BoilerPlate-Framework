import { APIActions } from '@base/APIActions';
import { getCredentials } from '../../testConfig';
import { test, expect } from '@playwright/test';

const apiActions = new APIActions();

test(`@API generateToken`, async ({ request }) => {
    const { username, password } = getCredentials();
    const requestBody = {
        username: username,
        password: password,
    };

    const token = await apiActions.generateToken(request, requestBody);

    expect(token, `Token should not be null or undefined.`).toBeTruthy();
    expect(token.trim().length, `Token should not be empty.`).toBeGreaterThan(0);
    expect(typeof token, `Token should be a valid string value.`).toBe(`string`);
});
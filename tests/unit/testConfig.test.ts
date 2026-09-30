import { test, expect } from '@playwright/test';

test('prints default env and region when TEST_ENV and TEST_REGION are not set', async () => {
    const originalEnv = process.env.TEST_ENV;
    const originalRegion = process.env.TEST_REGION;

    delete process.env.TEST_ENV;
    delete process.env.TEST_REGION;

    try {
        const { getCurrentEnvAndRegion, getDynamicBaseUrl, getCredentials } = await import('../../testConfig.js');

        const { env, region } = getCurrentEnvAndRegion();
        const baseUrl = getDynamicBaseUrl();
        const credentials = getCredentials();

        console.log(`Default values taken: env=${env}, region=${region}, baseURL=${baseUrl}, username=${credentials.username}`);

        expect(env).toBe('prod');
        expect(region).toBe('us');
        expect(baseUrl).toBe('https://www.saucedemo.com/');
        expect(credentials.username).toBe('standard_user');
        expect(credentials.password).toBe('secret_sauce');
    } finally {
        if (originalEnv === undefined) {
            delete process.env.TEST_ENV;
        } else {
            process.env.TEST_ENV = originalEnv;
        }

        if (originalRegion === undefined) {
            delete process.env.TEST_REGION;
        } else {
            process.env.TEST_REGION = originalRegion;
        }
    }
});


//to run this file - npx playwright test testConfig.test.ts
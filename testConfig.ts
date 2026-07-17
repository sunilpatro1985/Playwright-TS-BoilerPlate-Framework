type CredentialEntry = {
    role: string;
    username: string;
    password: string;
};

type CredentialsData = Record<string, Record<string, CredentialEntry[]>>;
const credentialsData = require('./credentials.json') as CredentialsData;

const domainURL = 'saucedemo.com';

// Use TEST_ENV/TEST_REGION to avoid conflicts with system environment variables (e.g., corporate shell hooks)
const ENV = process.env.TEST_ENV || 'prod';
const REGION = process.env.TEST_REGION || 'US';

function getCurrentEnvAndRegion(): { env: string; region: string } {
    const normalizedEnv = ENV.toLowerCase();
    const normalizedRegion = REGION.toLowerCase();

    // Only validate if an invalid value is provided (defaults are already valid)
    if (!['qa', 'dev', 'prod'].includes(normalizedEnv)) {
        console.log(`Please provide a correct environment value like "npx cross-env TEST_ENV=qa|dev|prod"`);
        process.exit();
    }

    if (!['us', 'uk'].includes(normalizedRegion)) {
        console.log(`Please provide a correct region value like "npx cross-env TEST_REGION=us|uk"`);
        process.exit();
    }

    return {
        env: normalizedEnv,
        region: normalizedRegion
    };
}



export const testConfig = {
    waitForElement: `120000`,
    dbUsername: ``,
    dbPassword: ``,
    dbServerName: ``,
    dbPort: ``,
    dbName: ``,
    // Set to true to auto-zip HTML report after local test runs
    // Set to false to skip zipping and save time during development
    zipReportLocally: false
};

export function getDynamicBaseUrl(): string {
    const { env, region } = getCurrentEnvAndRegion();

    if (env === 'prod' && region === 'us') {
        return 'https://www.saucedemo.com/';
    }

    const host = env === 'prod'
        ? `saucedemo.${region}`
        : `${env}.saucedemo.${region}`;

    return `https://${host}/`;
}

export function getCredentials(role = 'default'): { username: string; password: string } {
    const { env, region } = getCurrentEnvAndRegion();
    const regionKey = region.toUpperCase(); // credentials.json uses uppercase region keys
    
    const regionCredentials = credentialsData?.[env]?.[regionKey] ?? [];
    const selectedCredential = regionCredentials.find((entry) => entry.role?.toLowerCase() === role.toLowerCase())
        ?? regionCredentials[0]
        ?? { username: '', password: '' };

    return {
        username: selectedCredential.username ?? '',
        password: selectedCredential.password ?? ''
    };
}
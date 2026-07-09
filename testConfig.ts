type CredentialEntry = {
    role: string;
    username: string;
    password: string;
};

type CredentialsData = Record<string, Record<string, CredentialEntry[]>>;
const credentialsData = require('./credentials.json') as CredentialsData;

const domainURL = 'saucedemo.com';

const ENV = process.env.TEST_ENV ?? 'prod';
const REGION = process.env.TEST_REGION ?? 'US';

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



export const testConfig: Record<string, string> = {
    waitForElement: `120000`,
    dbUsername: ``,
    dbPassword: ``,
    dbServerName: ``,
    dbPort: ``,
    dbName: ``
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
    
    const regionCredentials = credentialsData?.[env]?.[region] ?? [];
    const selectedCredential = regionCredentials.find((entry) => entry.role?.toLowerCase() === role.toLowerCase())
        ?? regionCredentials[0]
        ?? { username: '', password: '' };

    return {
        username: selectedCredential.username ?? '',
        password: selectedCredential.password ?? ''
    };
}
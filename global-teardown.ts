import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { testConfig } from './testConfig';

/**
 * Global teardown runs BEFORE reporters finalize.
 * - In CI: Skip zipping (GitHub Actions workflow handles it after reporters finish)
 * - Locally: Zip only if zipReportLocally is enabled in testConfig
 * - Can also be controlled via ZIP_REPORT=true|false environment variable
 */
async function globalTeardown() {
    const isCI = process.env.CI === 'true';
    
    if (isCI) {
        console.log('🔄 CI environment detected - skipping zip (workflow handles it)');
        return;
    }

    // Check environment variable first, then fall back to config
    const zipEnvVar = process.env.ZIP_REPORT?.toLowerCase();
    const shouldZip = zipEnvVar !== undefined 
        ? zipEnvVar === 'true' 
        : testConfig.zipReportLocally;

    if (!shouldZip) {
        console.log('🔄 Local zip disabled (set zipReportLocally=true in testConfig or ZIP_REPORT=true)');
        return;
    }

    // Local run: wait for HTML reporter to finish writing files
    console.log('🔄 Local run - waiting for reporters to finalize...');
    await delay(3000); // Give reporters time to write files
    
    zipHtmlReport();
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function zipHtmlReport(): void {
    const reportPath = path.join(__dirname, 'html-report');
    const zipPath = path.join(__dirname, 'html-report.zip');

    if (!fs.existsSync(reportPath)) {
        console.log('⚠ html-report directory not found. Skipping zip creation.');
        return;
    }

    const files = fs.readdirSync(reportPath);
    if (files.length === 0) {
        console.log('⚠ html-report directory is empty. Skipping zip creation.');
        return;
    }

    try {
        const zip = new AdmZip();
        zip.addLocalFolder(reportPath, './html-report');
        zip.writeZip(zipPath);
        console.log('✓ Created html-report.zip');
    } catch (error) {
        console.log(`⚠ Failed to create zip: ${error}`);
    }
}

export default globalTeardown;
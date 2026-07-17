import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

/**
 * Zips the HTML report after tests complete.
 * Run this script after playwright tests to generate html-report.zip
 */
function zipReport() {
    const reportPath = path.join(__dirname, '..', 'html-report');
    const zipPath = path.join(__dirname, '..', 'html-report.zip');

    if (!fs.existsSync(reportPath)) {
        console.log('⚠ html-report directory not found. Skipping zip creation.');
        return;
    }

    const files = fs.readdirSync(reportPath);
    if (files.length === 0) {
        console.log('⚠ html-report directory is empty. Skipping zip creation.');
        return;
    }

    const zip = new AdmZip();
    zip.addLocalFolder(reportPath, './html-report');
    zip.writeZip(zipPath);
    console.log('✓ Created html-report.zip');
}

zipReport();

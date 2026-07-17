import * as fs from 'fs';
import * as path from 'path';
import CryptoJS from 'crypto-js';

interface EncryptionConfig {
  encryptionKey?: string;
  inputFile: string;
  outputFile: string;
}

const DEFAULT_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-change-this-in-production';

/**
 * Encrypts a JSON file using AES encryption
 * @param config Configuration object with encryption key and file paths
 * @returns Path to encrypted file or error message
 */
export function encryptCredentials(config: EncryptionConfig): string {
  try {
    const encryptionKey = config.encryptionKey || DEFAULT_ENCRYPTION_KEY;
    const inputPath = path.resolve(config.inputFile);
    const outputPath = path.resolve(config.outputFile);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Read the credentials file
    const fileContent = fs.readFileSync(inputPath, 'utf-8');

    // Encrypt the content
    const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey).toString();

    // Write encrypted content to output file
    fs.writeFileSync(outputPath, encrypted, 'utf-8');

    console.log(`✓ Credentials encrypted successfully`);
    console.log(`  Input:  ${inputPath}`);
    console.log(`  Output: ${outputPath}`);

    return outputPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Encryption failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Decrypts an encrypted credentials file back to JSON
 * @param config Configuration object with encryption key and file paths
 * @returns Path to decrypted file or error message
 */
export function decryptCredentials(config: EncryptionConfig): string {
  try {
    const encryptionKey = config.encryptionKey || DEFAULT_ENCRYPTION_KEY;
    const inputPath = path.resolve(config.inputFile);
    const outputPath = path.resolve(config.outputFile);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Encrypted file not found: ${inputPath}`);
    }

    // Read the encrypted file
    const encryptedContent = fs.readFileSync(inputPath, 'utf-8');

    // Decrypt the content
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, encryptionKey).toString(CryptoJS.enc.Utf8);

    // Validate that decrypted content is valid JSON
    if (!decrypted) {
      throw new Error('Decryption failed. The encryption key may be incorrect.');
    }

    // Parse to validate JSON structure
    JSON.parse(decrypted);

    // Write decrypted content to output file
    fs.writeFileSync(outputPath, decrypted, 'utf-8');

    console.log(`✓ Credentials decrypted successfully`);
    console.log(`  Input:  ${inputPath}`);
    console.log(`  Output: ${outputPath}`);

    return outputPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Decryption failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * CLI handler for encryption/decryption
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!command || !['encrypt', 'decrypt'].includes(command)) {
    console.log(`
Usage:
  npx ts-node utils/credentials-encryptor.ts encrypt
  npx ts-node utils/credentials-encryptor.ts decrypt

Environment Variables:
  ENCRYPTION_KEY - The encryption/decryption key (optional, uses default if not set)

Examples:
  ENCRYPTION_KEY="my-secret-key" npx ts-node utils/credentials-encryptor.ts encrypt
  ENCRYPTION_KEY="my-secret-key" npx ts-node utils/credentials-encryptor.ts decrypt
    `);
    process.exit(1);
  }

  const config: EncryptionConfig = {
    encryptionKey: encryptionKey,
    inputFile: command === 'encrypt' ? 'credentials.json' : 'credentials.enc.json',
    outputFile: command === 'encrypt' ? 'credentials.enc.json' : 'credentials.json',
  };

  if (command === 'encrypt') {
    encryptCredentials(config);
  } else if (command === 'decrypt') {
    decryptCredentials(config);
  }
}

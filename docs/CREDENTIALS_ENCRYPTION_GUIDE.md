# Credentials Encryption/Decryption Guide

This guide explains how to use the encryption/decryption utilities to securely manage your `credentials.json` file.

## Overview

The `credentials.json` file contains sensitive test data (usernames, passwords, API keys, etc.) that should **never** be committed to git in plain text. Instead:

1. **Encrypt** `credentials.json` → `credentials.enc.json`
2. **Commit** only `credentials.enc.json` to git (safe)
3. **Decrypt** `credentials.enc.json` → `credentials.json` locally or in CI/CD

---

## Quick Start

### 1. **Set Up Encryption Key**

You need a secure encryption key. Choose one of these options:

#### Option A: Generate a Random Key (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Option B: Use a Custom Key
```bash
ENCRYPTION_KEY="my-super-secret-key-min-16-chars"
```

**Important:** Store this key securely:
- **Locally**: Set in your `.env` file (already in `.gitignore`)
- **GitHub Actions**: Set as a repository secret named `ENCRYPTION_KEY`

### 2. **Encrypt Your Credentials**

Run locally to create the encrypted file:

```bash
# Using default key (for testing only)
npm run creds:encrypt

# Using a custom key
ENCRYPTION_KEY="my-super-secret-key-min-16-chars" npm run creds:encrypt
```

**Output:**
- Reads: `credentials.json`
- Creates: `credentials.enc.json`
- Original file remains unchanged

### 3. **Add to Git** (Only the Encrypted File)

```bash
git add credentials.enc.json
git commit -m "Add encrypted credentials"
git push
```

**Verify .gitignore includes:**
```
# credentials.json (plain text - NEVER commit this)
credentials.enc.json
```

### 4. **Decrypt When Needed**

#### Locally:
```bash
# Using the same key you encrypted with
ENCRYPTION_KEY="my-super-secret-key-min-16-chars" npm run creds:decrypt
```

#### In GitHub Actions:
```yaml
- name: Decrypt credentials
  env:
    ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
  run: npm run creds:decrypt
```

---

## Usage Examples

### Local Development Workflow

```bash
# 1. First time setup - encrypt your credentials
ENCRYPTION_KEY="your-secure-key" npm run creds:encrypt

# 2. Commit encrypted file
git add credentials.enc.json
git commit -m "Add encrypted credentials"

# 3. Decrypt for local testing (when needed)
ENCRYPTION_KEY="your-secure-key" npm run creds:decrypt

# 4. Run tests
npm test

# 5. credentials.json is in .gitignore, so it won't be committed
```

### GitHub Actions Workflow

1. **Set GitHub Secret:**
   - Go to repo Settings → Secrets and variables → Actions
   - Create secret named `ENCRYPTION_KEY` with your encryption key

2. **Update your workflow:**
   ```yaml
   - name: Checkout code
     uses: actions/checkout@v4
   
   - name: Setup Node.js
     uses: actions/setup-node@v4
     with:
       node-version: '20'
       cache: 'npm'
   
   - name: Install dependencies
     run: npm ci
   
   # Decrypt credentials before running tests
   - name: Decrypt credentials
     env:
       ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
     run: npm run creds:decrypt
   
   # Now credentials.json is available for your tests
   - name: Run tests
     run: npm test
   ```

### Team Collaboration

```bash
# When teammate pulls encrypted credentials:
git pull

# Get encryption key from team lead (via secure channel)
# Add to .env file (gitignored)
echo "ENCRYPTION_KEY=your-key-here" >> .env

# Decrypt locally
npm run creds:decrypt

# Now you can run tests
npm test
```

---

## API Usage in Code

### Import the Functions

```typescript
import { encryptCredentials, decryptCredentials } from './utils/credentials-encryptor';

// Encrypt
encryptCredentials({
  encryptionKey: 'your-secret-key',
  inputFile: 'credentials.json',
  outputFile: 'credentials.enc.json'
});

// Decrypt
decryptCredentials({
  encryptionKey: 'your-secret-key',
  inputFile: 'credentials.enc.json',
  outputFile: 'credentials.json'
});
```

### Use Default Encryption Key

```typescript
// Uses ENCRYPTION_KEY env variable, falls back to default
encryptCredentials({
  inputFile: 'credentials.json',
  outputFile: 'credentials.enc.json'
});
```

---

## Environment Variables

### `.env` File (Local Development)

```bash
# .env (gitignored - for local development only)
ENCRYPTION_KEY=your-secret-key-here
```

Load it in your shell:
```bash
source .env
npm run creds:decrypt
```

Or inline:
```bash
ENCRYPTION_KEY="your-key" npm run creds:decrypt
```

### GitHub Actions Secret

1. Go to repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `ENCRYPTION_KEY`
4. Value: Your secure encryption key
5. Use in workflows: `${{ secrets.ENCRYPTION_KEY }}`

---

## Security Best Practices

### ✅ DO:
- Use a strong, randomly generated encryption key (at least 32 characters)
- Store the key in GitHub Secrets (not in code)
- Store the key locally in `.env` (gitignored)
- Rotate keys periodically
- Share keys via secure channels (not email, Slack, Discord)
- Delete `credentials.json` after decrypting locally (if you don't need it)

### ❌ DON'T:
- Commit `credentials.json` to git
- Share encryption keys in plain text
- Use weak/short encryption keys
- Commit `.env` files
- Store keys in code comments or documentation
- Reuse the same key across multiple projects

---

## Troubleshooting

### "Decryption failed. The encryption key may be incorrect."

**Solution:** Verify you're using the correct encryption key:
```bash
# Make sure the key matches what you used to encrypt
ENCRYPTION_KEY="exact-key-used-to-encrypt" npm run creds:decrypt
```

### "Input file not found"

**Solution:** Ensure the file exists before encryption/decryption:
```bash
# Verify files exist
ls -la credentials.json      # For encryption
ls -la credentials.enc.json  # For decryption
```

### "JSON is invalid"

**Solution:** The original JSON may be malformed. Check it:
```bash
cat credentials.json | jq .
```

### GitHub Actions: "credentials.json not found"

**Solution:** Ensure decryption step runs before tests:
```yaml
- name: Decrypt credentials
  env:
    ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
  run: npm run creds:decrypt

- name: Verify decryption
  run: test -f credentials.json && echo "OK" || echo "FAILED"

- name: Run tests  # This comes AFTER decryption
  run: npm test
```

---

## Workflow Files

### Available npm Scripts:

```bash
npm run creds:encrypt   # Encrypt credentials.json → credentials.enc.json
npm run creds:decrypt   # Decrypt credentials.enc.json → credentials.json
```

### CLI Direct Usage:

```bash
# Encrypt
npx ts-node utils/credentials-encryptor.ts encrypt

# Decrypt
npx ts-node utils/credentials-encryptor.ts decrypt
```

---

## Example Directory Structure

```
project-root/
├── credentials.json           (gitignored - never commit)
├── credentials.enc.json       (commit to git)
├── .env                       (gitignored - local only)
├── .gitignore                 (includes both above)
├── utils/
│   └── credentials-encryptor.ts    (utility functions)
├── package.json               (has new npm scripts)
└── .github/workflows/
    └── decrypt-credentials-example.yaml    (example workflow)
```

---

## Additional Resources

- [CryptoJS Documentation](https://github.com/brix/crypto-js)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

---

## Questions?

Refer to `.github/workflows/decrypt-credentials-example.yaml` for a complete example or check the comments in `utils/credentials-encryptor.ts`.

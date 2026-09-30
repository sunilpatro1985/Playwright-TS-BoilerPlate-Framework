#!/bin/bash

# App Data Encryption Setup Script
# This script helps you set up the encryption/decryption system for appData.json

set -e

echo "=========================================="
echo "App Data Encryption Setup"
echo "=========================================="
echo ""

# Check if appData.json exists
if [ ! -f "appData.json" ]; then
    echo "❌ Error: appData.json not found"
    echo "Please ensure appData.json exists in the project root"
    exit 1
fi

# Generate or accept encryption key
if [ -z "$ENCRYPTION_KEY" ]; then
    echo "No ENCRYPTION_KEY environment variable found."
    echo ""
    echo "Generate a secure key with:"
    echo "  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    echo ""
    read -p "Enter your encryption key: " ENCRYPTION_KEY
fi

if [ -z "$ENCRYPTION_KEY" ]; then
    echo "❌ Encryption key is required"
    exit 1
fi

export ENCRYPTION_KEY

# Encrypt the app data
echo ""
echo "Encrypting appData.json..."
npm run creds:encrypt

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify appData.enc.json was created: ls -la appData.enc.json"
echo "2. Add encrypted file to git: git add appData.enc.json"
echo "3. Commit: git commit -m 'Add encrypted app data'"
echo "4. Store encryption key in GitHub Secrets or .env file"
echo ""
echo "To decrypt locally later:"
echo "  ENCRYPTION_KEY=\"$ENCRYPTION_KEY\" npm run creds:decrypt"
echo ""
echo "To decrypt in GitHub Actions:"
echo "  Set ENCRYPTION_KEY as a repository secret in Settings > Secrets and variables > Actions"
echo "  Then use in workflow: ENCRYPTION_KEY: \${{ secrets.ENCRYPTION_KEY }}"
echo ""

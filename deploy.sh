#!/bin/bash

# Deployment script for Mandal Minds to GitLab Pages
# This script can be run locally to test the deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Navigate to app directory
cd app

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "📊 Build statistics:"
du -sh dist/

echo "📁 Build contents:"
ls -la dist/

# Create public directory for GitLab Pages
cd ..
echo "🗂️  Preparing GitLab Pages directory..."
rm -rf public
mkdir -p public
cp -r app/dist/* public/

echo "✅ Deployment preparation complete!"
echo "📍 Files ready in 'public' directory for GitLab Pages"
echo "🌐 When pushed to GitLab, your site will be available at:"
echo "   https://<username>.gitlab.io/<repository-name>"

# Optional: Serve locally for testing
if command -v python3 &> /dev/null; then
    echo ""
    echo "🧪 To test locally, you can run:"
    echo "   cd public && python3 -m http.server 8000"
    echo "   Then visit: http://localhost:8000"
elif command -v python &> /dev/null; then
    echo ""
    echo "🧪 To test locally, you can run:"
    echo "   cd public && python -m SimpleHTTPServer 8000"
    echo "   Then visit: http://localhost:8000"
fi

#!/bin/bash

# Build script for aisixteen.com website
# This script automates the complete build and deployment process

set -e  # Exit on any error

echo "🚀 Starting build process for aisixteen.com..."

# Step 1: Clean docs directory
echo "🧹 Cleaning docs directory..."
if [ -d "docs" ]; then
    rm -rf docs/*
    echo "✅ Docs directory cleaned"
else
    echo "📁 Docs directory doesn't exist, will be created during build"
fi

# Step 2: Run the build command
echo "🔨 Building the project..."
npm run build

# Step 3: Ensure CNAME file exists in docs with aisixteen.com
echo "🌐 Setting up CNAME for aisixteen.com..."
echo "aisixteen.com" > docs/CNAME
echo "✅ CNAME file created in docs/"

# Step 4: Add and commit all changes
echo "📝 Committing changes..."
git add .
git commit -m "Build: Updated site build $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️  No changes to commit"

echo "✅ Build process completed successfully!"
echo "📋 Summary:"
echo "   - Docs directory cleaned"
echo "   - Project built with Vite"
echo "   - CNAME configured for aisixteen.com"
echo "   - Changes committed to git"
echo ""
echo "🌍 Your site is ready for deployment!"

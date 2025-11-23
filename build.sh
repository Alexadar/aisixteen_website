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

# Step 2: Run the build command (includes CNAME copy in postbuild)
echo "🔨 Building the project..."
npm run build

# Step 3: Add and commit all changes
echo "📝 Committing changes..."
git add .
git commit -m "Build: Updated site build $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️  No changes to commit"

echo "✅ Build process completed successfully!"
echo "📋 Summary:"
echo "   - Docs directory cleaned"
echo "   - Project built with Vite (includes CNAME copy)"
echo "   - Changes committed to git"
echo ""
echo "🌍 Your site is ready for deployment!"

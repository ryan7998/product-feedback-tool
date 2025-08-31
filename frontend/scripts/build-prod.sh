#!/bin/bash

# Production Build Script for Product Feedback Tool
# This script builds the React app for production deployment on Hostinger

echo "🚀 Building Product Feedback Tool for Production..."

# Set production environment
export REACT_APP_ENVIRONMENT=production

# Update API URL for production (replace with your actual domain)
export REACT_APP_API_BASE_URL=https://yourdomain.com/api

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build files are in the 'build' directory"
    echo "📊 Build size:"
    du -sh build/
    
    echo ""
    echo "🎯 Next steps:"
    echo "1. Upload the 'build' folder contents to your Hostinger hosting"
    echo "2. Configure your domain to point to the hosting directory"
    echo "3. Set up SSL certificate for HTTPS"
    echo "4. Configure your Laravel backend API on the same domain"
    
else
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi

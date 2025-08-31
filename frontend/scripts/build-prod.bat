@echo off
REM Production Build Script for Product Feedback Tool (Windows)
REM This script builds the React app for production deployment on Hostinger

echo 🚀 Building Product Feedback Tool for Production...

REM Set production environment
set REACT_APP_ENVIRONMENT=production

REM Update API URL for production (replace with your actual domain)
set REACT_APP_API_BASE_URL=https://feedbacktool.onthis.website/api

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist build rmdir /s /q build

REM Install dependencies if needed
echo 📦 Installing dependencies...
npm install

REM Build for production
echo 🔨 Building for production...
npm run build

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo ✅ Production build completed successfully!
    echo 📁 Build files are in the 'build' directory
    
    echo.
    echo 🎯 Next steps:
    echo 1. Upload the 'build' folder contents to your Hostinger hosting
    echo 2. Configure your domain to point to the hosting directory
    echo 3. Set up SSL certificate for HTTPS
    echo 4. Configure your Laravel backend API on the same domain
    
) else (
    echo ❌ Build failed! Please check the error messages above.
    pause
    exit /b 1
)

pause

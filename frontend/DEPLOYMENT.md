# 🚀 Product Feedback Tool - Deployment Guide

## 📋 Overview

This guide covers deploying the Product Feedback Tool to both development and production environments, with specific instructions for Hostinger hosting.

## 🏗️ Environment Configuration

### Development Environment

-   **API URL**: `http://localhost:8000/api`
-   **Frontend URL**: `http://localhost:3000`
-   **Environment**: `development`
-   **Debug**: Enabled
-   **Source Maps**: Enabled

### Production Environment (Hostinger)

-   **API URL**: `https://feedbacktool.onthis.website/api`
-   **Frontend URL**: `https://feedbacktool.onthis.website`
-   **Environment**: `production`
-   **Debug**: Disabled
-   **Source Maps**: Disabled

## 🔧 Configuration Files

### 1. Environment Variables

Copy `env.example` to `.env.local` for development:

```bash
# Development
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development

# Production (update with your domain)
REACT_APP_API_BASE_URL=https://feedbacktool.onthis.website/api
REACT_APP_ENVIRONMENT=production
```

### 2. Build Scripts

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Or use the script files
./scripts/build-prod.sh    # Linux/Mac
scripts/build-prod.bat      # Windows
```

## 🚀 Production Deployment on Hostinger

### Step 1: Prepare Your Domain

1. **Domain Setup**: Ensure your domain is properly configured in Hostinger
2. **SSL Certificate**: Enable HTTPS (Hostinger provides free SSL)
3. **DNS Configuration**: Point your domain to Hostinger's nameservers

### Step 2: Build for Production

```bash
# Windows
scripts/build-prod.bat

# Linux/Mac
./scripts/build-prod.sh
```

**Important**: Update the API URL in the build script with your actual domain!

### Step 3: Upload to Hostinger

1. **File Manager**: Use Hostinger's File Manager or FTP
2. **Upload Location**: Upload contents of `build/` folder to `public_html/`
3. **File Structure**:
    ```
    public_html/
    ├── index.html
    ├── static/
    │   ├── css/
    │   ├── js/
    │   └── media/
    └── favicon.svg
    ```

### Step 4: Configure Backend API

1. **Laravel Backend**: Deploy your Laravel API to the same domain
2. **API Endpoint**: Configure to use `/api` subdirectory
3. **CORS Settings**: Update to allow your domain

## 🔒 Security Considerations

### Production Security

-   **HTTPS Only**: Force HTTPS redirects
-   **CORS Configuration**: Restrict to your domain only
-   **Environment Variables**: Never expose sensitive data in frontend
-   **API Keys**: Store securely on backend only

### CORS Configuration (Laravel)

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://feedbacktool.onthis.website'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 📱 Performance Optimization

### Build Optimizations

-   **Code Splitting**: React automatically splits code
-   **Tree Shaking**: Unused code is removed
-   **Minification**: CSS and JS are minified
-   **Compression**: Enable GZIP on Hostinger

### Hostinger Settings

1. **GZIP Compression**: Enable in cPanel
2. **Browser Caching**: Set appropriate cache headers
3. **CDN**: Consider using Hostinger's CDN
4. **Image Optimization**: Compress images before upload

## 🧪 Testing Deployment

### Pre-Deployment Checklist

-   [ ] Environment variables configured
-   [ ] API endpoints updated
-   [ ] Build completes without errors
-   [ ] All features work in development

### Post-Deployment Testing

-   [ ] Frontend loads correctly
-   [ ] API calls work (check browser console)
-   [ ] Authentication flows work
-   [ ] Responsive design on mobile
-   [ ] Performance is acceptable

## 🔍 Troubleshooting

### Common Issues

#### 1. API Calls Failing

-   **Check**: Browser console for CORS errors
-   **Solution**: Verify API URL and CORS configuration

#### 2. 404 Errors

-   **Check**: File paths and upload location
-   **Solution**: Ensure all build files are uploaded

#### 3. Build Failures

-   **Check**: Node.js version compatibility
-   **Solution**: Use Node.js 16+ and npm 8+

#### 4. Performance Issues

-   **Check**: Bundle size and network requests
-   **Solution**: Enable compression and caching

### Debug Commands

```bash
# Check build size
npm run analyze

# Test production build locally
npm run build
npx serve -s build

# Check environment variables
echo $REACT_APP_API_BASE_URL
```

## 📚 Additional Resources

### Hostinger Documentation

-   [Hostinger File Manager Guide](https://www.hostinger.com/tutorials/file-manager)
-   [SSL Certificate Setup](https://www.hostinger.com/tutorials/ssl)
-   [Domain Configuration](https://www.hostinger.com/tutorials/domain)

### React Deployment

-   [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
-   [Build Optimization](https://create-react-app.dev/docs/optimizing-build-size/)

### Laravel Deployment

-   [Laravel Deployment Guide](https://laravel.com/docs/deployment)
-   [Hostinger Laravel Setup](https://www.hostinger.com/tutorials/laravel)

## 🎯 Next Steps

1. **Create Production Branch**: `git checkout -b production`
2. **Update Configuration**: Set production API URLs
3. **Test Build**: Ensure production build works locally
4. **Deploy**: Use the build scripts to deploy to Hostinger
5. **Monitor**: Check performance and error logs

---

**Need Help?** Check the troubleshooting section or refer to the official documentation for your hosting provider.

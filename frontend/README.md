# Product Feedback Tool - Frontend

React frontend for the Product Feedback Tool application.

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```bash
# API Configuration
REACT_APP_API_URL=http://127.0.0.1:8000/api

# App Configuration
REACT_APP_NAME=Product Feedback Tool
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_DEBUG=true
```

**Note:** All React environment variables must start with `REACT_APP_`

### Default Configuration

If no `.env` file is provided, the app will use these defaults:

-   **API URL**: `http://127.0.0.1:8000/api`
-   **App Name**: `Product Feedback Tool`
-   **Version**: `1.0.0`
-   **Debug**: Enabled in development mode

## Development

### Prerequisites

-   Node.js 16+
-   npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will run on `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   │   ├── Login.js    # Login form
│   │   ├── Register.js # Registration form
│   │   └── AuthContainer.js # Auth container
│   └── Dashboard.js    # Main dashboard
├── contexts/            # React contexts
│   └── AuthContext.js  # Authentication context
├── config/              # Configuration files
│   └── config.js       # App configuration
└── App.js              # Main app component
```

## Features

-   ✅ User Authentication (Login/Register)
-   ✅ Token Management
-   ✅ Protected Routes
-   ✅ Responsive Design
-   ✅ Error Handling
-   ✅ Loading States

## API Integration

The frontend communicates with the Laravel backend API through:

-   **Base URL**: Configurable via `REACT_APP_API_URL`
-   **Authentication**: Bearer token in Authorization header
-   **CORS**: Configured for cross-origin requests
-   **Endpoints**: Centralized in `config.js`

## Next Steps

-   [ ] Feedback Management
-   [ ] Comment System
-   [ ] User Dashboard
-   [ ] Admin Features

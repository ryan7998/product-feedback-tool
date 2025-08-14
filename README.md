# Product Feedback Tool

A web-based Product Feedback Tool that allows users to submit and view product feedback, facilitating communication between users and the product development team.

## Architecture

-   **Backend**: Laravel 12.x API with Sanctum authentication
-   **Frontend**: React.js SPA (Single Page Application)
-   **Database**: SQLite (development) / MySQL/PostgreSQL (production)

## Features

-   User authentication and authorization
-   Feedback submission with categories
-   Commenting system with user mentions
-   Responsive design for mobile and desktop
-   Real-time updates (planned)

## Project Structure

```
product-feedback-tool/
├── app/                    # Laravel backend application
│   ├── Http/             # Controllers, Middleware, Requests
│   ├── Models/           # Eloquent models
│   └── Services/         # Business logic services
├── database/             # Migrations, seeders, factories
├── routes/               # API routes
├── tests/                # Backend tests
└── frontend/             # React frontend (to be created)
```

## Getting Started

### Backend Setup

1. Install dependencies: `composer install`
2. Copy `.env.example` to `.env` and configure
3. Generate app key: `php artisan key:generate`
4. Run migrations: `php artisan migrate`
5. Start server: `php artisan serve`

### Frontend Setup (Coming Soon)

1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## API Endpoints (Planned)

-   `POST /api/auth/register` - User registration
-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `GET /api/feedback` - List feedback items
-   `POST /api/feedback` - Submit new feedback
-   `GET /api/feedback/{id}` - Get feedback details
-   `POST /api/feedback/{id}/comments` - Add comment
-   `GET /api/feedback/{id}/comments` - Get feedback comments

## Development Workflow

We'll implement this project step by step with small, manageable commits:

1. ✅ Project setup and git initialization
2. 🔄 API structure and authentication
3. 🔄 Database models and migrations
4. 🔄 API endpoints and controllers
5. 🔄 Frontend React setup
6. 🔄 UI components and state management
7. 🔄 Integration and testing

## Technologies

-   **Backend**: Laravel 12.x, PHP 8.2+
-   **Frontend**: React 18+, TypeScript (planned)
-   **Authentication**: Laravel Sanctum
-   **Database**: SQLite (dev), MySQL/PostgreSQL (prod)
-   **Build Tools**: Vite, Laravel Mix

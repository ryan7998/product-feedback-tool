# Product Feedback Tool

A modern, full-featured web application that allows users to submit, view, and discuss product feedback with rich formatting and @mentions support. Built with Laravel 12.x backend API and React.js frontend.

## 📸 Screenshots

### **Main Dashboard**

![Product Feedback Tool Dashboard](images/screenshot.png)

_The main dashboard showing feedback list with filtering options and modern UI design._

---

## 🚀 Features

### **Core Functionality**

-   **User Authentication** - Secure registration, login, and logout with Laravel Sanctum
-   **Feedback Management** - Submit, view, edit, and delete feedback items
-   **Category System** - Organize feedback by type (bug reports, feature requests, improvements, general)
-   **Rich Commenting** - Advanced commenting system with real-time formatting preview
-   **@Mentions** - Facebook-style user mentions with search and autocomplete
-   **Responsive Design** - Mobile-first, modern UI that works on all devices

### **Advanced Features**

-   **Text Formatting** - Support for **bold**, _italic_, and `code` blocks
-   **Real-time Preview** - See formatting as you type
-   **User Search** - Intelligent user search for @mentions
-   **Pagination** - Efficient loading of feedback and comments
-   **Authorization** - Users can only edit their own content
-   **CORS Support** - Configured for cross-origin frontend integration

## 🏗️ Architecture

-   **Backend**: Laravel 12.x API with Sanctum authentication
-   **Frontend**: React 18+ Single Page Application
-   **Database**: MySQL 8.0+ (production-ready)
-   **Authentication**: Laravel Sanctum with JWT-like tokens
-   **API**: RESTful API with JSON responses
-   **Styling**: Inline CSS with modern design principles

## 📋 Prerequisites

### **System Requirements**

-   PHP 8.2 or higher
-   MySQL 8.0 or higher
-   Node.js 16+ and npm
-   Composer (PHP package manager)
-   Git

### **PHP Extensions**

```bash
php-bcmath
php-curl
php-dom
php-fileinfo
php-json
php-mbstring
php-mysql
php-openssl
php-pdo
php-tokenizer
php-xml
php-zip
```

## 🛠️ Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/ryan7998/product-feedback-tool
cd product-feedback-tool
```

### **2. Backend Setup (Laravel)**

#### **Install PHP Dependencies**

```bash
composer install
```

#### **Environment Configuration**

```bash
# Copy demo environment file (contains both backend and frontend configs)
cp demo.env .env

# Note: APP_KEY is already included in demo.env
# This single .env file handles both Laravel backend and React frontend configurations
```

#### **Update .env File**

```bash
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=product_feedback_tool
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# App Configuration
APP_NAME=Product_Feedback_Tool
APP_ENV=local
APP_DEBUG=true

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_ALLOWED_METHODS=*
CORS_SUPPORTS_CREDENTIALS=true

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

#### **Create MySQL Database**

```bash
mysql -u root -p
CREATE DATABASE product_feedback_tool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### **Run Database Migrations**

```bash
php artisan migrate
```

#### **Seed Demo Data**

```bash
php artisan db:seed --class=DatabaseSeeder
```

#### **Start Laravel Server**

```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000`

### **3. Frontend Setup (React)**

#### **Navigate to Frontend Directory**

```bash
cd frontend
```

#### **Install Node Dependencies**

```bash
npm install
```

**Note:** Environment configuration is already handled in the backend setup above. The single `.env` file contains both backend and frontend configurations.

#### **Start React Development Server**

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🧪 Demo Data

The application comes with pre-seeded demo data:

### **Demo Users**

-   **John Smith** (john@example.com) - password: `password`
-   **Sarah Johnson** (sarah@example.com) - password: `password`
-   **Mike Chen** (mike@example.com) - password: `password`
-   **Emily Davis** (emily@example.com) - password: `password`
-   **Alex Rodriguez** (alex@example.com) - password: `password`
-   **Lisa Wang** (lisa@example.com) - password: `password`
-   **David Brown** (david@example.com) - password: `password`

### **Sample Feedback**

-   Performance optimization requests
-   Bug reports
-   Feature requests (dark mode, export functionality)
-   General improvements

### **Sample Comments**

-   Comments with @mentions
-   Formatted text examples
-   Code block examples

## 📚 API Endpoints

### **Public Endpoints**

```
POST /api/auth/register    - User registration
POST /api/auth/login       - User authentication
GET  /api/health          - Health check
```

### **Protected Endpoints (Require Authentication)**

```
POST   /api/auth/logout                    - User logout
GET    /api/auth/user                      - Get current user
GET    /api/feedback                       - List feedback (paginated)
POST   /api/feedback                       - Create new feedback
GET    /api/feedback/{id}                  - Get feedback details
PUT    /api/feedback/{id}                  - Update feedback
DELETE /api/feedback/{id}                  - Delete feedback
GET    /api/feedback/category/{category}   - Filter by category
GET    /api/feedback/{id}/comments         - Get feedback comments
POST   /api/feedback/{id}/comments         - Add comment
PUT    /api/feedback/{id}/comments/{id}    - Update comment
DELETE /api/feedback/{id}/comments/{id}    - Delete comment
GET    /api/users/search                   - Search users for @mentions
```

## 🎨 Formatting Guide

### **Text Formatting**

-   **Bold Text**: `**your text**` → **your text**
-   **Italic Text**: `*your text*` → _your text_
-   **Code Blocks**: `` `your code` `` → `your code`

### **@Mentions**

-   Type `@` followed by a user's name
-   Names must start with capital letters (e.g., `@John Smith`)
-   Real-time search with dropdown selection
-   Automatic highlighting in comments

### **Examples**

```
This is **really important** feedback about the *user experience*.
The error code is `SQLSTATE[23000]` and I agree with @John Smith.
```

## 🔧 Configuration

### **Backend Configuration Files**

-   `config/database.php` - Database connections
-   `config/cors.php` - CORS policy settings
-   `bootstrap/app.php` - Application bootstrap
-   `routes/api.php` - API route definitions

### **Frontend Configuration Files**

-   `frontend/src/config/config.js` - API endpoints and app settings
-   `frontend/.env` - Environment variables

## 🚀 Development

### **Backend Development**

```bash
# Run tests
php artisan test

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes
php artisan route:list --path=api

# Database operations
php artisan migrate:status
php artisan migrate:rollback
php artisan migrate:fresh --seed
```

### **Frontend Development**

```bash
# Build for production
npm run build

# Run tests
npm test

# Check for linting issues
npm run lint
```

## 📁 Project Structure

```
product-feedback-tool/
├── app/
│   ├── Http/Controllers/          # API Controllers
│   │   ├── Auth/                 # Authentication
│   │   ├── FeedbackController.php # Feedback management
│   │   └── CommentController.php  # Comment management
│   └── Models/                   # Eloquent models
│       ├── User.php              # User model
│       ├── Feedback.php          # Feedback model
│       └── Comment.php           # Comment model
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── routes/
│   └── api.php                   # API route definitions
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── feedback/        # Feedback components
│   │   │   └── common/          # Shared components
│   │   ├── contexts/            # React contexts
│   │   └── config/              # Configuration files
│   └── public/                   # Static assets
└── config/                       # Laravel configuration
```

## 🔒 Security Features

-   **Authentication**: Laravel Sanctum with secure token management
-   **Authorization**: Users can only modify their own content
-   **Input Validation**: Comprehensive validation on all inputs
-   **SQL Injection Protection**: Eloquent ORM with parameterized queries
-   **XSS Protection**: HTML escaping for user-generated content
-   **CORS Configuration**: Secure cross-origin request handling

## 🌟 Key Features in Detail

### **Smart @Mentions System**

-   Real-time user search with debouncing
-   Keyboard navigation (arrow keys, enter, escape)
-   Automatic insertion with proper cursor positioning
-   Visual highlighting in comments

### **Rich Text Formatting**

-   Markdown-style syntax for easy use
-   Live preview while typing
-   HTML-safe code blocks
-   Professional styling with CSS

### **Responsive Design**

-   Mobile-first approach
-   Touch-friendly interface
-   Adaptive layouts for all screen sizes
-   Modern UI components

### **Performance Optimizations**

-   Pagination for large datasets
-   Efficient database queries with eager loading
-   Debounced search to reduce API calls
-   Optimized React rendering

## 🐛 Troubleshooting

### **Common Issues**

#### **Database Connection Error**

```bash
# Check MySQL service
sudo service mysql status

# Verify credentials in .env
# Ensure database exists
mysql -u root -p -e "SHOW DATABASES;"
```

#### **CORS Issues**

```bash
# Check CORS configuration in config/cors.php
# Verify frontend URL in CORS_ALLOWED_ORIGINS
# Clear Laravel cache
php artisan config:clear
```

#### **Frontend Build Issues**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

## 📈 Production Deployment

### **Environment Variables**

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=your_mysql_host
DB_DATABASE=your_production_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### **Build Commands**

```bash
# Backend
composer install --optimize-autoloader --no-dev

# Frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🆘 Support

For support and questions:

-   Check the troubleshooting section above
-   Review the API documentation
-   Open an issue on GitHub

---

**Built with ❤️ using Laravel and React**

# Web Sale Project

A full-stack e-commerce web application built with Django backend.

## Project Structure

```
web-sale/
├── backend/              # Django backend application
│   ├── authentication/   # User authentication system
│   ├── backend/          # Main Django project settings
│   ├── common/           # Shared utilities and base classes
│   ├── manage.py         # Django management script
│   ├── requirements.txt  # Python dependencies
│   └── Makefile         # Development commands
└── README.md            # This file
```

## Quick Start

### Prerequisites

- Python 3.11+
- uv (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-sale
   ```

2. Initialize the backend:
   ```bash
   cd backend
   make init
   ```

3. Run database migrations:
   ```bash
   make migrate
   ```

4. Start the development server:
   ```bash
   make run
   ```

The backend will be available at `http://localhost:8000`

## Backend Features

- **Authentication System**: JWT-based user authentication
- **User Management**: User registration, login, and profile management
- **API Documentation**: Automatic OpenAPI schema generation
- **Testing**: Comprehensive test suite with coverage reporting
- **Code Quality**: Automated linting and formatting with Ruff

## Development Commands

All commands should be run from the `backend/` directory:

```bash
make init           # Install dependencies
make run            # Start development server
make test           # Run tests
make coverage       # Run tests with coverage
make lint           # Check code quality
make format         # Format code
make check          # Lint and format together
make schema         # Generate API schema
```

## API Endpoints

- `/admin/` - Django admin interface
- `/api/auth/` - Authentication endpoints
- `/api/users/` - User management endpoints

## Technology Stack

### Backend
- **Framework**: Django 5.2.5
- **Database**: SQLite (development)
- **Authentication**: Django REST Framework + SimpleJWT
- **API**: Django REST Framework
- **Testing**: Django Test Framework + Coverage
- **Code Quality**: Ruff

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Run `make check` before committing
4. Ensure all tests pass with `make test`

## License

This project is for educational purposes.
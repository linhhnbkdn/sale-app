# Web Sale Backend

A Django REST Framework backend for a web-sale project with JWT authentication, comprehensive testing, and modern development tools.

## Features

- **Django 5.2.5** with Django REST Framework
- **JWT Authentication** with token rotation and blacklisting
- **Object-Oriented Architecture** with separated concerns
- **Comprehensive Testing** with 99%+ coverage
- **Code Quality Tools** with Ruff linting and formatting
- **API Documentation** with drf-spectacular (OpenAPI/Swagger)
- **Environment Management** with uv

## Quick Start

### Prerequisites

- Python 3.8+
- uv (Python package manager)

### Installation

1. Clone the repository and navigate to the backend directory
2. Initialize the project:
   ```bash
   make init
   ```

### Development Commands

```bash
# Initialize project (install dependencies, setup environment)
make init

# Start development server
make run

# Code quality
make lint          # Check code with Ruff
make format        # Format code with Ruff
make check         # Run both lint and format

# Testing
make test          # Run all tests
make coverage      # Run tests with coverage
make coverage-report  # Show coverage report
make coverage-html    # Generate HTML coverage report

# API Documentation
make schema        # Generate OpenAPI schema
```

## Project Structure

```
backend/
├── authentication/           # Authentication app
│   ├── serializers/         # Separated serializers
│   │   ├── auth_serializer.py
│   │   └── user_serializer.py
│   ├── views/              # Separated views
│   │   ├── auth_views.py
│   │   └── user_views.py
│   ├── tests/              # Comprehensive E2E tests
│   └── urls.py
├── backend/                # Django project settings
│   ├── settings.py         # Main settings
│   ├── constants.py        # Environment configuration
│   └── urls.py
├── common/                 # Shared utilities
│   └── base_test_case.py   # Base test case with utilities
├── pyproject.toml          # Dependencies and tool configuration
├── Makefile               # Development commands
├── CLAUDE.md              # Claude Code documentation
└── README.md              # This file
```

## Authentication

The project implements JWT authentication with the following features:

- **User Registration**: Create new user accounts
- **User Login/Logout**: JWT token-based authentication
- **Token Refresh**: Automatic token rotation
- **Token Blacklisting**: Secure token invalidation
- **Profile Management**: User profile CRUD operations

### API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/token/` - Obtain JWT token pair
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## Testing

The project maintains 99%+ test coverage with comprehensive E2E tests covering:

- Authentication flows (register, login, logout)
- JWT token management (obtain, refresh, blacklist)
- User profile operations
- Edge cases and error handling
- Serializer validation
- View behavior

Run tests with coverage:
```bash
make coverage
make coverage-html  # Generate HTML report in htmlcov/
```

## Configuration

Environment variables are managed in `backend/constants.py`:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (default: True)
- `ALLOWED_HOSTS` - Comma-separated allowed hosts
- `JWT_ACCESS_TOKEN_LIFETIME` - Access token lifetime in minutes (default: 60)
- `JWT_REFRESH_TOKEN_LIFETIME` - Refresh token lifetime in days (default: 7)
- `JWT_ROTATE_REFRESH_TOKENS` - Enable token rotation (default: True)
- `CORS_ALLOWED_ORIGINS` - Comma-separated CORS origins
- `TIME_ZONE` - Timezone (default: UTC)
- `LANGUAGE_CODE` - Language code (default: en-us)

## Code Quality

The project enforces code quality with:

- **Ruff** for linting and formatting
- **80-character line limit** for readability
- **Import sorting** and organization
- **Type hints** where applicable
- **Docstrings** for all public methods

Configuration is in `pyproject.toml`.

## Architecture

The project follows Django best practices with:

- **Separation of Concerns**: Serializers, views, and tests are separated
- **Object-Oriented Design**: Class-based views and reusable components
- **DRY Principle**: Shared utilities in common module
- **Test-Driven Development**: Comprehensive test suite
- **Configuration Management**: Environment-based settings

## Contributing

1. Follow the existing code style (enforced by Ruff)
2. Write comprehensive tests for new features
3. Maintain test coverage above 95%
4. Update documentation for API changes
5. Run `make check` before committing

## Development Notes

- The project uses `uv` for fast dependency management
- Tests are organized by functionality (auth, token, profile, etc.)
- All API endpoints return consistent JSON responses
- Error handling provides meaningful error messages
- JWT tokens include user information for client convenience
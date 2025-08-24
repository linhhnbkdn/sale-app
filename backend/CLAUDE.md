# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django web application backend for a web-sale project. The codebase follows Django's standard project structure with a fresh Django 5.2.5 installation.

## Architecture

- **Framework**: Django 5.2.5
- **Database**: SQLite (development default)
- **Project Structure**: Standard Django layout with `backend/` as the main project directory
- **WSGI/ASGI**: Configured for both synchronous and asynchronous deployment

## Development Commands

### Running the Development Server
```bash
python manage.py runserver
```

### Database Management
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Django Admin
Access the admin interface at `/admin/` after creating a superuser.

### Testing
```bash
python manage.py test
```

### Django Shell
```bash
python manage.py shell
```

### Code Quality (Ruff)
```bash
ruff check .                  # Lint code
ruff check . --fix            # Lint and auto-fix issues
ruff format .                 # Format code
ruff check . && ruff format . # Lint and format together
```

## Project Structure

```
backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── pyproject.toml           # Ruff configuration
└── backend/                  # Main project package
    ├── __init__.py
    ├── settings.py          # Django settings
    ├── urls.py              # URL routing
    ├── wsgi.py              # WSGI configuration
    └── asgi.py              # ASGI configuration
```

## Key Configuration

- **Settings Module**: `backend.settings`
- **Database**: SQLite database at `db.sqlite3`
- **Static Files**: Served from `static/` URL
- **Admin Interface**: Available at `/admin/`

## Development Notes

- The project uses Django's default SQLite database for development
- Debug mode is enabled in settings
- No custom apps have been created yet - this is a fresh Django project
- Secret key is currently using Django's insecure default (should be changed for production)
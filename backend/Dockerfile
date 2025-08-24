# Backend Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        python3-dev \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy uv files
COPY pyproject.toml uv.lock ./

# Install Python dependencies
RUN uv sync --frozen

# Copy project
COPY . .

# Collect static files and migrate database
RUN /app/.venv/bin/python manage.py collectstatic --noinput || true
RUN /app/.venv/bin/python manage.py migrate || true

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["/app/.venv/bin/python", "manage.py", "runserver", "0.0.0.0:8000"]
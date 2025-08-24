.PHONY: init lint format check schema run test coverage coverage-report coverage-html help

help:
	@echo "Available commands:"
	@echo "  init           - Install dependencies with uv"
	@echo "  lint           - Run ruff linting"
	@echo "  format         - Format code with ruff"
	@echo "  check          - Run lint and format together"
	@echo "  schema         - Generate OpenAPI schema"
	@echo "  run            - Run Django development server"
	@echo "  test           - Run Django unit tests"
	@echo "  coverage       - Run tests with coverage"
	@echo "  coverage-report- Show coverage report"
	@echo "  coverage-html  - Generate HTML coverage report"

init:
	uv sync

lint:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/ruff check .

format:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/ruff format .

check: lint format

schema:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/python manage.py spectacular --color --file schema.yaml

run:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/python manage.py runserver

test:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/python manage.py test

coverage:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/coverage run --source='.' manage.py test authentication
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/coverage report

coverage-report:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/coverage report

coverage-html:
	/Users/hoang.ngoc.linh/Desktop/self-learning/web-sale/backend/.venv/bin/coverage html
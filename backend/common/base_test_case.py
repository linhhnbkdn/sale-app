from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.setup_test_data()

    def setup_test_data(self):
        """Override this method in child classes to set up specific test data"""
        pass

    def create_test_user(
        self,
        username="testuser",
        email="test@example.com",
        password="testpass123",
    ):
        """Create a test user"""
        return User.objects.create_user(
            username=username, email=email, password=password
        )

    def get_jwt_tokens(self, user):
        """Get JWT tokens for a user"""
        refresh = RefreshToken.for_user(user)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}

    def authenticate_user(self, user):
        """Authenticate user with JWT token"""
        tokens = self.get_jwt_tokens(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        return tokens

    def logout_user(self):
        """Remove authentication credentials"""
        self.client.credentials()

    def assert_response_success(self, response):
        """Assert response is successful (2xx)"""
        self.assertTrue(200 <= response.status_code < 300)

    def assert_response_error(self, response):
        """Assert response is an error (4xx or 5xx)"""
        self.assertTrue(response.status_code >= 400)

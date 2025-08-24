from rest_framework import serializers

from authentication.serializers import (
    UserLoginSerializer,
    UserRegistrationSerializer,
)
from common.base_test_case import BaseTestCase


class SerializersE2ETestCase(BaseTestCase):
    def setup_test_data(self):
        self.active_user = self.create_test_user(
            username="activeuser",
            email="active@example.com",
            password="activepass123",
        )

        self.inactive_user = self.create_test_user(
            username="inactiveuser",
            email="inactive@example.com",
            password="inactivepass123",
        )
        self.inactive_user.is_active = False
        self.inactive_user.save()

    def test_login_serializer_with_inactive_user(self):
        """Test login serializer with inactive user that validates but authenticate fails"""
        # Create an active user first, then deactivate to test the inactive path
        from unittest.mock import patch

        serializer_data = {
            "username": "activeuser",  # Use active user
            "password": "activepass123",
        }

        # Mock authenticate to return an inactive user
        with patch(
            "authentication.serializers.auth_serializer.authenticate"
        ) as mock_auth:
            mock_user = self.active_user
            mock_user.is_active = False
            mock_auth.return_value = mock_user

            serializer = UserLoginSerializer(data=serializer_data)
            with self.assertRaises(serializers.ValidationError) as context:
                serializer.is_valid(raise_exception=True)

            self.assertIn("User account is disabled", str(context.exception))

    def test_login_serializer_missing_username(self):
        """Test login serializer with missing username"""
        serializer_data = {"password": "somepassword"}

        serializer = UserLoginSerializer(data=serializer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
        self.assertIn("required", str(serializer.errors["username"][0]))

    def test_login_serializer_missing_password(self):
        """Test login serializer with missing password"""
        serializer_data = {"username": "activeuser"}

        serializer = UserLoginSerializer(data=serializer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)
        self.assertIn("required", str(serializer.errors["password"][0]))

    def test_login_serializer_empty_credentials(self):
        """Test login serializer with empty credentials"""
        serializer_data = {"username": "", "password": ""}

        serializer = UserLoginSerializer(data=serializer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)
        self.assertIn("password", serializer.errors)

    def test_registration_serializer_validation_errors(self):
        """Test registration serializer edge cases"""
        # Test with existing username
        serializer_data = {
            "username": "activeuser",  # Already exists
            "email": "newemail@example.com",
            "password": "newpass123",
            "password_confirm": "newpass123",
        }

        serializer = UserRegistrationSerializer(data=serializer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_registration_serializer_short_password(self):
        """Test registration with short password"""
        serializer_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "123",  # Too short
            "password_confirm": "123",
        }

        serializer = UserRegistrationSerializer(data=serializer_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_login_serializer_empty_values_validation_path(self):
        """Test the specific validation path for empty username/password after field validation passes"""

        # We need to patch CharField validation to allow empty values through to our custom validation
        serializer_data = {"username": "test", "password": "test"}

        # Create a serializer and manually call validate with empty values
        serializer = UserLoginSerializer(data=serializer_data)
        serializer.is_valid()  # This will populate initial_data

        # Now test the validate method directly with empty values
        with self.assertRaises(serializers.ValidationError) as context:
            serializer.validate({"username": "", "password": "test"})
        self.assertIn(
            "Must provide username and password", str(context.exception)
        )

        with self.assertRaises(serializers.ValidationError) as context:
            serializer.validate({"username": "test", "password": ""})
        self.assertIn(
            "Must provide username and password", str(context.exception)
        )

        with self.assertRaises(serializers.ValidationError) as context:
            serializer.validate({"username": None, "password": "test"})
        self.assertIn(
            "Must provide username and password", str(context.exception)
        )

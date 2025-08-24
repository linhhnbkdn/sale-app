from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

from common.base_test_case import BaseTestCase


class ProfileE2ETestCase(BaseTestCase):
    def setup_test_data(self):
        self.profile_url = reverse("authentication:profile")

        self.test_user = self.create_test_user(
            username="profileuser",
            email="profile@example.com",
            password="profilepass123",
        )
        self.test_user.first_name = "Profile"
        self.test_user.last_name = "User"
        self.test_user.save()

    def test_get_profile_authenticated_user(self):
        """Test getting profile for authenticated user"""
        self.authenticate_user(self.test_user)

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "profileuser")
        self.assertEqual(response.data["email"], "profile@example.com")
        self.assertEqual(response.data["first_name"], "Profile")
        self.assertEqual(response.data["last_name"], "User")
        self.assertIn("id", response.data)
        self.assertIn("date_joined", response.data)

    def test_get_profile_unauthenticated_user(self):
        """Test getting profile without authentication"""
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_success(self):
        """Test successful profile update"""
        self.authenticate_user(self.test_user)

        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "email": "updated@example.com",
        }

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["first_name"], "Updated")
        self.assertEqual(response.data["user"]["last_name"], "Name")
        self.assertEqual(response.data["user"]["email"], "updated@example.com")

        # Verify changes in database
        updated_user = User.objects.get(id=self.test_user.id)
        self.assertEqual(updated_user.first_name, "Updated")
        self.assertEqual(updated_user.last_name, "Name")
        self.assertEqual(updated_user.email, "updated@example.com")

    def test_update_profile_partial_data(self):
        """Test partial profile update"""
        self.authenticate_user(self.test_user)

        update_data = {"first_name": "PartialUpdate"}

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["first_name"], "PartialUpdate")
        self.assertEqual(
            response.data["user"]["last_name"], "User"
        )  # Should remain unchanged
        self.assertEqual(
            response.data["user"]["email"], "profile@example.com"
        )  # Should remain unchanged

    def test_update_profile_with_invalid_email(self):
        """Test profile update with invalid email"""
        self.authenticate_user(self.test_user)

        update_data = {"email": "invalid_email_format"}

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_update_profile_with_duplicate_email(self):
        """Test profile update with email that belongs to another user"""
        # Create another user with different email
        other_user = self.create_test_user(
            username="otheruser",
            email="other@example.com",
            password="otherpass123",
        )

        self.authenticate_user(self.test_user)

        update_data = {
            "email": "other@example.com"  # Try to use other user's email
        }

        response = self.client.put(self.profile_url, update_data, format="json")

        # Django User model doesn't enforce unique emails by default, so this should succeed
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["email"], "other@example.com")

    def test_update_profile_unauthenticated(self):
        """Test profile update without authentication"""
        update_data = {"first_name": "ShouldFail"}

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_readonly_fields(self):
        """Test that readonly fields cannot be updated"""
        self.authenticate_user(self.test_user)
        original_id = self.test_user.id
        original_date_joined = self.test_user.date_joined

        update_data = {
            "id": 99999,  # Try to change ID
            "date_joined": "2020-01-01T00:00:00Z",  # Try to change date_joined
            "first_name": "ValidUpdate",
        }

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify readonly fields weren't changed
        updated_user = User.objects.get(id=self.test_user.id)
        self.assertEqual(updated_user.id, original_id)
        self.assertEqual(updated_user.date_joined, original_date_joined)
        self.assertEqual(
            updated_user.first_name, "ValidUpdate"
        )  # This should change

    def test_complete_profile_management_flow(self):
        """Test complete flow: authenticate -> get profile -> update -> verify changes"""
        # Step 1: Authenticate
        tokens = self.authenticate_user(self.test_user)

        # Step 2: Get initial profile
        initial_response = self.client.get(self.profile_url)
        self.assertEqual(initial_response.status_code, status.HTTP_200_OK)
        initial_data = initial_response.data

        # Step 3: Update profile
        update_data = {
            "first_name": "CompleteFlow",
            "last_name": "Test",
            "email": "completeflow@example.com",
        }
        update_response = self.client.put(
            self.profile_url, update_data, format="json"
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        # Step 4: Verify changes by getting profile again
        final_response = self.client.get(self.profile_url)
        self.assertEqual(final_response.status_code, status.HTTP_200_OK)
        final_data = final_response.data

        # Verify changes
        self.assertEqual(final_data["first_name"], "CompleteFlow")
        self.assertEqual(final_data["last_name"], "Test")
        self.assertEqual(final_data["email"], "completeflow@example.com")

        # Verify unchanged fields
        self.assertEqual(final_data["id"], initial_data["id"])
        self.assertEqual(final_data["username"], initial_data["username"])
        self.assertEqual(final_data["date_joined"], initial_data["date_joined"])

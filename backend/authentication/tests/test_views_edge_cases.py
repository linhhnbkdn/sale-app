from django.urls import reverse
from rest_framework import status

from common.base_test_case import BaseTestCase


class ViewsEdgeCasesTestCase(BaseTestCase):
    def setup_test_data(self):
        self.token_url = reverse("authentication:token_obtain_pair")
        self.test_user = self.create_test_user(
            username="edgeuser",
            email="edge@example.com",
            password="edgepass123",
        )

    def test_custom_token_obtain_pair_view_success(self):
        """Test CustomTokenObtainPairView includes user data on success"""
        credentials = {"username": "edgeuser", "password": "edgepass123"}

        response = self.client.post(self.token_url, credentials, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], "edgeuser")

    def test_custom_token_obtain_pair_view_failure(self):
        """Test CustomTokenObtainPairView handles failure gracefully"""
        credentials = {"username": "edgeuser", "password": "wrongpassword"}

        response = self.client.post(self.token_url, credentials, format="json")

        # Should fail and not include user data (this covers the else branch in CustomTokenObtainPairView)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("user", response.data)

    def test_logout_with_missing_refresh_token(self):
        """Test logout without providing refresh token"""
        self.authenticate_user(self.test_user)
        logout_url = reverse("authentication:logout")

        # Empty request data
        response = self.client.post(logout_url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_logout_with_malformed_refresh_token(self):
        """Test logout with malformed refresh token"""
        self.authenticate_user(self.test_user)
        logout_url = reverse("authentication:logout")

        logout_data = {"refresh": "clearly-not-a-valid-jwt-token"}
        response = self.client.post(logout_url, logout_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

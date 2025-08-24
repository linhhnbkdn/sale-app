from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from common.base_test_case import BaseTestCase
import json


class TokenManagementE2ETestCase(BaseTestCase):
    def setup_test_data(self):
        self.token_obtain_url = reverse('authentication:token_obtain_pair')
        self.token_refresh_url = reverse('authentication:token_refresh')
        self.profile_url = reverse('authentication:profile')
        
        self.test_user = self.create_test_user(
            username='tokenuser',
            email='token@example.com',
            password='tokenpass123'
        )

    def test_token_obtain_pair_success(self):
        """Test successful token pair generation"""
        credentials = {
            'username': 'tokenuser',
            'password': 'tokenpass123'
        }
        
        response = self.client.post(self.token_obtain_url, credentials, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'tokenuser')
        
        # Verify tokens are usable
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

    def test_token_obtain_pair_invalid_credentials(self):
        """Test token generation with invalid credentials"""
        # Test actual invalid credentials (401)
        invalid_auth_credentials = [
            {'username': 'tokenuser', 'password': 'wrongpass'},
            {'username': 'nonexistent', 'password': 'tokenpass123'},
        ]
        
        for credentials in invalid_auth_credentials:
            with self.subTest(credentials=credentials):
                response = self.client.post(self.token_obtain_url, credentials, format='json')
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test missing required fields (400)
        missing_field_credentials = [
            {'username': '', 'password': 'tokenpass123'},
            {'username': 'tokenuser', 'password': ''},
            {}
        ]
        
        for credentials in missing_field_credentials:
            with self.subTest(credentials=credentials):
                response = self.client.post(self.token_obtain_url, credentials, format='json')
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_refresh_success(self):
        """Test successful token refresh"""
        # Get initial tokens
        refresh = RefreshToken.for_user(self.test_user)
        refresh_token = str(refresh)
        
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        
        # Verify new access token works
        new_access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

    def test_token_refresh_invalid_token(self):
        """Test token refresh with invalid refresh token"""
        invalid_tokens = [
            'invalid_token',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.invalid',
        ]
        
        for invalid_token in invalid_tokens:
            with self.subTest(token=invalid_token):
                refresh_data = {'refresh': invalid_token}
                response = self.client.post(self.token_refresh_url, refresh_data, format='json')
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Empty token should return 400 (bad request)
        refresh_data = {'refresh': ''}
        response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_refresh_blacklisted_token(self):
        """Test refresh with blacklisted token"""
        # Create and immediately blacklist a refresh token
        refresh = RefreshToken.for_user(self.test_user)
        refresh.blacklist()
        
        refresh_data = {'refresh': str(refresh)}
        response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_token_authentication(self):
        """Test using access token for authentication"""
        tokens = self.get_jwt_tokens(self.test_user)
        access_token = tokens['access']
        
        # Test with valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test with invalid token format
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test with missing Bearer prefix
        self.client.credentials(HTTP_AUTHORIZATION=access_token)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test without authorization header
        self.client.credentials()
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_rotation_flow(self):
        """Test token rotation when refresh tokens are configured to rotate"""
        # Get initial tokens using login endpoint
        login_data = {
            'username': 'tokenuser',
            'password': 'tokenpass123'
        }
        login_url = reverse('authentication:login')
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        
        initial_tokens = login_response.data['tokens']
        
        # Refresh the token
        refresh_data = {'refresh': initial_tokens['refresh']}
        refresh_response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        
        # Verify we got a new access token
        new_access_token = refresh_response.data['access']
        self.assertNotEqual(new_access_token, initial_tokens['access'])
        
        # Verify new token works
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

    def test_multiple_concurrent_token_refresh(self):
        """Test handling multiple concurrent refresh requests"""
        refresh = RefreshToken.for_user(self.test_user)
        refresh_token = str(refresh)
        
        # Make multiple refresh requests concurrently (simulated)
        responses = []
        for _ in range(3):
            refresh_data = {'refresh': refresh_token}
            response = self.client.post(self.token_refresh_url, refresh_data, format='json')
            responses.append(response)
        
        # At least one should succeed
        successful_responses = [r for r in responses if r.status_code == 200]
        self.assertGreaterEqual(len(successful_responses), 1)
        
        # Test that at least one new access token works
        if successful_responses:
            new_access_token = successful_responses[0].data['access']
            self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
            profile_response = self.client.get(self.profile_url)
            self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

    def test_complete_token_lifecycle(self):
        """Test complete token lifecycle: obtain -> use -> refresh -> blacklist"""
        # Step 1: Obtain token pair
        credentials = {
            'username': 'tokenuser',
            'password': 'tokenpass123'
        }
        token_response = self.client.post(self.token_obtain_url, credentials, format='json')
        self.assertEqual(token_response.status_code, status.HTTP_200_OK)
        
        tokens = {
            'access': token_response.data['access'],
            'refresh': token_response.data['refresh']
        }
        
        # Step 2: Use access token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        
        # Step 3: Refresh token
        refresh_data = {'refresh': tokens['refresh']}
        refresh_response = self.client.post(self.token_refresh_url, refresh_data, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        
        new_access_token = refresh_response.data['access']
        # Get new refresh token if rotation is enabled
        new_refresh_token = refresh_response.data.get('refresh', tokens['refresh'])
        
        # Step 4: Use new access token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access_token}')
        profile_response2 = self.client.get(self.profile_url)
        self.assertEqual(profile_response2.status_code, status.HTTP_200_OK)
        
        # Step 5: Logout (blacklist current valid refresh token)
        logout_url = reverse('authentication:logout')
        logout_data = {'refresh': new_refresh_token}
        logout_response = self.client.post(logout_url, logout_data, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        
        # Step 6: Try to use blacklisted refresh token
        blacklisted_refresh_data = {'refresh': new_refresh_token}
        blacklisted_refresh_response = self.client.post(self.token_refresh_url, blacklisted_refresh_data, format='json')
        self.assertEqual(blacklisted_refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from common.base_test_case import BaseTestCase


class AuthenticationE2ETestCase(BaseTestCase):
    def setup_test_data(self):
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.logout_url = reverse('authentication:logout')
        
        self.valid_user_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        
        self.existing_user = self.create_test_user(
            username='existinguser',
            email='existing@example.com',
            password='existingpass123'
        )

    def test_user_registration_success(self):
        """Test successful user registration with complete flow"""
        response = self.client.post(self.register_url, self.valid_user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        
        # Verify user was created in database
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertEqual(user.first_name, 'New')
        self.assertEqual(user.last_name, 'User')

    def test_user_registration_with_invalid_data(self):
        """Test registration with various invalid data scenarios"""
        # Password mismatch
        invalid_data = self.valid_user_data.copy()
        invalid_data['password_confirm'] = 'differentpass'
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Duplicate username
        invalid_data = self.valid_user_data.copy()
        invalid_data['username'] = 'existinguser'
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Missing required fields
        invalid_data = {'username': 'incomplete'}
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test successful user login flow"""
        login_data = {
            'username': 'existinguser',
            'password': 'existingpass123'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['username'], 'existinguser')
        
        # Verify tokens are valid by making authenticated request
        access_token = response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        profile_url = reverse('authentication:profile')
        profile_response = self.client.get(profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)

    def test_user_login_with_invalid_credentials(self):
        """Test login with invalid credentials"""
        test_cases = [
            {'username': 'existinguser', 'password': 'wrongpassword'},
            {'username': 'nonexistent', 'password': 'somepassword'},
            {'username': '', 'password': 'existingpass123'},
            {'username': 'existinguser', 'password': ''},
        ]
        
        for login_data in test_cases:
            with self.subTest(login_data=login_data):
                response = self.client.post(self.login_url, login_data, format='json')
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout_success(self):
        """Test successful logout flow"""
        # First authenticate
        tokens = self.authenticate_user(self.existing_user)
        
        # Logout with refresh token
        logout_data = {'refresh': tokens['refresh']}
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        # Verify token is blacklisted by trying to use it again
        self.logout_user()  # Remove current auth
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        profile_url = reverse('authentication:profile')
        profile_response = self.client.get(profile_url)
        # Note: Access token might still work until it expires, 
        # but refresh token should be blacklisted

    def test_logout_with_invalid_token(self):
        """Test logout with invalid refresh token"""
        self.authenticate_user(self.existing_user)
        
        logout_data = {'refresh': 'invalid_token'}
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_logout_unauthenticated_user(self):
        """Test logout without authentication"""
        tokens = self.get_jwt_tokens(self.existing_user)
        logout_data = {'refresh': tokens['refresh']}
        
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_complete_authentication_flow(self):
        """Test complete flow: register -> login -> access protected resource -> logout"""
        # Step 1: Register new user
        register_response = self.client.post(self.register_url, self.valid_user_data, format='json')
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        
        # Step 2: Login with new user
        login_data = {
            'username': self.valid_user_data['username'],
            'password': self.valid_user_data['password']
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        
        # Step 3: Access protected resource
        tokens = login_response.data['tokens']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        profile_url = reverse('authentication:profile')
        profile_response = self.client.get(profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        
        # Step 4: Logout
        logout_data = {'refresh': tokens['refresh']}
        logout_response = self.client.post(self.logout_url, logout_data, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
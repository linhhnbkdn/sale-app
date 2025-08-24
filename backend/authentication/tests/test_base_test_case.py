from common.base_test_case import BaseTestCase


class MockResponse:
    def __init__(self, status_code):
        self.status_code = status_code


class BaseTestCaseTestCase(BaseTestCase):
    def setup_test_data(self):
        """Test the setup_test_data method override"""
        self.setup_was_called = True

    def test_setup_test_data_called(self):
        """Test that setup_test_data is called during setup"""
        self.assertTrue(hasattr(self, "setup_was_called"))
        self.assertTrue(self.setup_was_called)

    def test_create_test_user_defaults(self):
        """Test create_test_user with default parameters"""
        user = self.create_test_user()
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpass123"))

    def test_create_test_user_custom_params(self):
        """Test create_test_user with custom parameters"""
        user = self.create_test_user(
            username="customuser",
            email="custom@example.com",
            password="custompass123",
        )
        self.assertEqual(user.username, "customuser")
        self.assertEqual(user.email, "custom@example.com")
        self.assertTrue(user.check_password("custompass123"))

    def test_get_jwt_tokens(self):
        """Test JWT token generation"""
        user = self.create_test_user()
        tokens = self.get_jwt_tokens(user)

        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)
        self.assertIsInstance(tokens["access"], str)
        self.assertIsInstance(tokens["refresh"], str)

    def test_authenticate_user(self):
        """Test user authentication"""
        user = self.create_test_user()
        tokens = self.authenticate_user(user)

        self.assertIn("access", tokens)
        self.assertIn("refresh", tokens)
        # Check that credentials are set on the client
        self.assertIn("HTTP_AUTHORIZATION", self.client._credentials)

    def test_logout_user(self):
        """Test logout user functionality"""
        user = self.create_test_user()
        self.authenticate_user(user)

        # Ensure we're authenticated
        self.assertIn("HTTP_AUTHORIZATION", self.client._credentials)

        # Logout
        self.logout_user()

        # Ensure credentials are cleared
        self.assertNotIn("HTTP_AUTHORIZATION", self.client._credentials)

    def test_assert_response_success(self):
        """Test assertResponseSuccess helper"""
        # Test successful responses
        for status_code in [200, 201, 204, 299]:
            with self.subTest(status_code=status_code):
                response = MockResponse(status_code)
                # Should not raise an exception
                self.assertResponseSuccess(response)

    def test_assert_response_success_failure(self):
        """Test assertResponseSuccess with non-success status codes"""
        # Test non-successful responses
        for status_code in [199, 300, 400, 404, 500]:
            with self.subTest(status_code=status_code):
                response = MockResponse(status_code)
                with self.assertRaises(AssertionError):
                    self.assertResponseSuccess(response)

    def test_assert_response_error(self):
        """Test assertResponseError helper"""
        # Test error responses
        for status_code in [400, 401, 404, 500, 503]:
            with self.subTest(status_code=status_code):
                response = MockResponse(status_code)
                # Should not raise an exception
                self.assertResponseError(response)

    def test_assert_response_error_failure(self):
        """Test assertResponseError with non-error status codes"""
        # Test non-error responses
        for status_code in [200, 201, 204, 301, 399]:
            with self.subTest(status_code=status_code):
                response = MockResponse(status_code)
                with self.assertRaises(AssertionError):
                    self.assertResponseError(response)

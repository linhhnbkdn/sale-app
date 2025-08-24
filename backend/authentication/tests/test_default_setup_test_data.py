from common.base_test_case import BaseTestCase


class DefaultSetupTestCase(BaseTestCase):
    """Test case that doesn't override setup_test_data to test the
    default pass statement"""

    def test_default_setup_does_not_fail(self):
        """Test that default setup_test_data works without override"""
        # The setUp method calls setup_test_data, which has a pass statement
        # This test covers that line
        self.assertIsNotNone(self.client)
        # If we get here, the pass statement in setup_test_data was executed

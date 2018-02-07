<?php
/**
 * Admin plugin tests.
 */

class Test_Admin extends WP_UnitTestCase {

    /**
     * Check that a sync token gets created when instantiating the admin class
     */
    function test_create_sync_token() {
        delete_option( 'disqus_sync_token' );

        new Disqus_Admin( 'disqus', '0.0.0', 'foo' );

        $this->assertEquals( 32, strlen( get_option( 'disqus_sync_token' ) ) );
    }

}

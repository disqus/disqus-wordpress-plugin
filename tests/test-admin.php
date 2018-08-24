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

    /**
     * Check that the REST URL filter doesn't replace the host when they're the same.
     */
    function test_dsq_filter_rest_url_same_host() {
        $admin = new Disqus_Admin( 'disqus', '0.0.0', 'foo' );

        $rest_url = $admin->dsq_filter_rest_url( 'https://example.org/wp-json/disqus/v1' );

        $this->assertEquals( 'https://example.org/wp-json/disqus/v1', $rest_url );
    }

    /**
     * Check that the REST URL filter does replace the host when they're different.
     */
    function test_dsq_filter_rest_url_different_host() {
        $admin = new Disqus_Admin( 'disqus', '0.0.0', 'foo' );
        $previous_host = $_SERVER['HTTP_HOST'];
        $_SERVER['HTTP_HOST'] = 'bar.com';

        $rest_url = $admin->dsq_filter_rest_url( 'https://example.org/wp-json/disqus/v1' );

        $this->assertEquals( 'https://bar.com/wp-json/disqus/v1', $rest_url );

        $_SERVER['HTTP_HOST'] = $previous_host;
    }

    /**
     * Ensure that REST URL filter will not error when HTTP_HOST is undefined.
     */
    function test_dsq_filter_rest_url_no_host() {
        $admin = new Disqus_Admin( 'disqus', '0.0.0', 'foo' );
        $previous_host = $_SERVER['HTTP_HOST'];
        $_SERVER['HTTP_HOST'] = NULL;
        $init_url = 'https://example.org/wp-json/disqus/v1';

        $rest_url = $admin->dsq_filter_rest_url($init_url);

        $this->assertEquals( $init_url, $rest_url );
    }

}

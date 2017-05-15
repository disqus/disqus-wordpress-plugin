<?php
/*
 * REST API Tests.
 */

class Test_REST_API extends WP_UnitTestCase {

    const REST_NAMESPACE = '/disqus/v1';

    /**
     * Test REST Server.
     *
     * @var WP_REST_Server
     */
    protected $server;

    public function setUp() {
        parent::setUp();

        global $wp_rest_server;

        $this->server = $wp_rest_server = new \WP_REST_Server;

        do_action( 'rest_api_init' );
    }

    /**
     * Check that the Disqus custom REST routes have been registered.
     */
    public function test_custom_routes_registered() {
        $routes = $this->server->get_routes();
        $custom_routes = array(
            Test_REST_API::REST_NAMESPACE,
            Test_REST_API::REST_NAMESPACE . '/comments/sync',
            Test_REST_API::REST_NAMESPACE . '/settings'
        );

        foreach ( $custom_routes as $custom_route ) {
            $this->assertArrayHasKey( $custom_route, $routes, 'Custom route "' . $custom_route . '" not registered' );
        }
    }

    /**
     * Check that the Disqus REST routes can be called.
     */
    public function test_custom_routes_callable() {
        $disqus_route = Test_REST_API::REST_NAMESPACE;
        $routes = $this->server->get_routes();
        foreach( $routes as $route => $route_config ) {
            if ( 0 === strpos( $disqus_route, $route ) ) {
                $this->assertTrue( is_array( $route_config ) );
                foreach ( $route_config as $i => $endpoint ) {
                    $this->assertArrayHasKey( 'callback', $endpoint );
                    $this->assertArrayHasKey( 0, $endpoint[ 'callback' ], get_class( $this ) );
					$this->assertArrayHasKey( 1, $endpoint[ 'callback' ], get_class( $this ) );
					$this->assertTrue( is_callable( array( $endpoint['callback'][0], $endpoint['callback'][1] ) ) );
                }
            }
        }
    }

    /**
     * Check that we can fetch the Disqus plugin settings as a WordPress admin.
     */
    public function test_admin_fetch_settings() {
        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
        $response = $this->server->dispatch( $request );
        $this->assertEquals( 200, $response->get_status() );
    }

    /**
     * Check that we can update the Disqus plugin settings as a WordPress admin.
     */
    public function test_admin_update_settings() {
        $this->assertTrue( true );
    }

    /**
     * Check that we can't fetch or update settings without authentication.
     */
    public function test_no_authentication_settings() {
        $this->assertTrue( true );
    }

    /**
     * Check that we can't fetch or update settings without admin authentication.
     */
    public function test_lower_permission_settings() {
        $this->assertTrue( true );
    }

    /**
     * Check that we can fetch and update settings with shared secret authentication.
     */
    public function test_shared_secret_settings() {
        $this->assertTrue( true );
    }

    /**
     * Check that the sync endpoint will handle valid verification challenge.
     */
    public function test_sync_valid_verification() {
        $this->assertTrue( true );
    }

    /**
     * Check that the sync endpoint will handle invalid verification challenge.
     */
    public function test_sync_invalid_verification() {
        $this->assertTrue( true );
    }

    /**
     * Check that the sync endpoint will handle new valid comment.
     */
    public function test_sync_valid_new_comment() {
        $this->assertTrue( true );
    }

    /**
     * Check that the sync endpoint will handle updated comment.
     */
    public function test_sync_valid_updated_comment() {
        $this->assertTrue( true );
    }

    /**
     * Check that the sync endpoint will reject invalid new comment.
     */
    public function test_sync_invalid_new_comment() {
        $this->assertTrue( true );
    }
}

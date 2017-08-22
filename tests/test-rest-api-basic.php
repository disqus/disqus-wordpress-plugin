<?php
/*
 * REST API Tests.
 */

class Test_REST_API_Basic extends WP_UnitTestCase {

    /**
     * Test REST Server.
     *
     * @var WP_REST_Server
     */
    protected $server;

    /**
     * User ID for 'administrator' role.
     *
     * @var int
     */
    private $admin_user_id;

    /**
     * User ID for 'subscriber' role, has the fewest permissions.
     *
     * @var int
     */
    private $subscriber_user_id;

    public function setUp() {
        parent::setUp();

        $this->admin_user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );
        $this->subscriber_user_id = $this->factory->user->create( array( 'role' => 'subscriber' ) );

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
            DISQUS_REST_NAMESPACE,
            DISQUS_REST_NAMESPACE . '/sync/webhook',
            DISQUS_REST_NAMESPACE . '/sync/status',
            DISQUS_REST_NAMESPACE . '/sync/enable',
            DISQUS_REST_NAMESPACE . '/sync/disable',
            DISQUS_REST_NAMESPACE . '/settings'
        );

        foreach ( $custom_routes as $custom_route ) {
            $this->assertArrayHasKey( $custom_route, $routes, 'Custom route "' . $custom_route . '" not registered' );
        }
    }

    /**
     * Check that the Disqus REST routes can be called.
     */
    public function test_custom_routes_callable() {
        $disqus_route = DISQUS_REST_NAMESPACE;
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
        wp_set_current_user( $this->admin_user_id );

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
        $response = $this->server->dispatch( $request );

        $this->assertEquals( 200, $response->get_status() );
    }

    /**
     * Check that we can't fetch or update settings without authentication.
     */
    public function test_no_authentication_settings() {
        wp_set_current_user( null );

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
        $response = $this->server->dispatch( $request );
        $this->assertEquals( 401, $response->get_status() );
    }

    /**
     * Check that we can't fetch or update settings without admin authentication.
     */
    public function test_lower_permission_settings() {
        wp_set_current_user( $this->subscriber_user_id );

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
        $response = $this->server->dispatch( $request );
        $this->assertEquals( 401, $response->get_status() );
    }

    /**
     * Check that we can fetch settings with shared secret authentication.
     */
    public function test_valid_shared_secret() {
        wp_set_current_user( null );
        update_option( 'disqus_sync_token', 'valid_token' );

        $body = json_encode( array(
            'disqus_forum_url' => 'rossbob',
        ) );
        $hub_signature = hash_hmac( 'sha512', $body, 'valid_token' );

        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/settings' );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );

        $response = $this->server->dispatch( $request );
        $this->assertEquals( 200, $response->get_status() );
    }

    /**
     * Check that we can't fetch settings with bad secret authentication.
     */
    public function test_invalid_shared_secret() {
        wp_set_current_user( null );
        update_option( 'disqus_sync_token', 'valid_token' );

        $body = json_encode( array(
            'disqus_forum_url' => 'rossbob',
        ) );
        $hub_signature = hash_hmac( 'sha512', $body, 'not_valid_token' );

        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/settings' );
        $request->set_body_params( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );

        $response = $this->server->dispatch( $request );
        $this->assertEquals( 401, $response->get_status() );
    }
}

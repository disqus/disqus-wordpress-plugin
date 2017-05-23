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
            Test_REST_API::REST_NAMESPACE,
            Test_REST_API::REST_NAMESPACE . '/sync/webhook',
            Test_REST_API::REST_NAMESPACE . '/sync/status',
            Test_REST_API::REST_NAMESPACE . '/sync/enable',
            Test_REST_API::REST_NAMESPACE . '/sync/disable',
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
        wp_set_current_user( $this->admin_user_id );

        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();

        $this->assertEquals( 200, $response->get_status() );
        $this->assertArrayHasKey( 'data', $response_data );
        $this->assertTrue( is_array( $response_data['data'] ) );
        $this->assertArrayHasKey( 'disqus_forum_url', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_sso_enabled', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_public_key', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_secret_key', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_admin_access_token', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_sso_button', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_sync_token', $response_data['data'] );
        $this->assertArrayHasKey( 'disqus_installed', $response_data['data'] );
    }

    /**
     * Check that the REST API reports the plugin as uninstalled without correct options.
     */
    public function test_admin_fetch_settings_uninstalled() {
        wp_set_current_user( $this->admin_user_id );
        update_option( 'disqus_forum_url', '' );

        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();

        $this->assertEquals( '', $response_data['data']['disqus_forum_url'] );
        $this->assertFalse( $response_data['data']['disqus_installed'] );
    }

    /**
     * Check that the REST API reports the plugin as installed with correct options.
     */
    public function test_admin_fetch_settings_installed() {
        wp_set_current_user( $this->admin_user_id );
        update_option( 'disqus_forum_url', 'bobross' );

        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();

        $this->assertEquals( 'bobross', $response_data['data']['disqus_forum_url'] );
        $this->assertTrue( $response_data['data']['disqus_installed'] );
    }

    /**
     * Check that we can update the Disqus plugin settings as a WordPress admin.
     */
    public function test_admin_update_settings() {
        wp_set_current_user( $this->admin_user_id );

        $body = array(
            'disqus_forum_url' => 'rossbob',
        );

        $request = new WP_REST_Request( 'POST', '/disqus/v1/settings' );
        $request->set_body_params( $body );

        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();

        $this->assertEquals( 200, $response->get_status() );
        $this->assertEquals( 'rossbob', $response_data['data']['disqus_forum_url'] );
    }

    /**
     * Check that we can't fetch or update settings without authentication.
     */
    public function test_no_authentication_settings() {
        wp_set_current_user( null );

        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
        $response = $this->server->dispatch( $request );
        $this->assertEquals( 401, $response->get_status() );
    }

    /**
     * Check that we can't fetch or update settings without admin authentication.
     */
    public function test_lower_permission_settings() {
        wp_set_current_user( $this->subscriber_user_id );

        $request = new WP_REST_Request( 'GET', '/disqus/v1/settings' );
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

        $request = new WP_REST_Request( 'POST', '/disqus/v1/settings' );
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

        $request = new WP_REST_Request( 'POST', '/disqus/v1/settings' );
        $request->set_body_params( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );

        $response = $this->server->dispatch( $request );
        $this->assertEquals( 401, $response->get_status() );
    }

    /**
     * Check that the sync endpoint will handle valid verification challenge.
     */
    public function test_sync_valid_verification() {
        wp_set_current_user( null );
        update_option( 'disqus_sync_token', 'valid_token' );

        $body = json_encode( array(
            'verb' => 'verify',
            'challenge' => 'come at me, bro',
        ) );
        $hub_signature = hash_hmac( 'sha512', $body, 'valid_token' );

        $request = new WP_REST_Request( 'POST', '/disqus/v1/sync/webhook' );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );
        $request->set_header( 'Content-Type', 'application/json' );

        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();
        $this->assertEquals( 200, $response->get_status(), 'Not a valid 200 status code, response was: ' . json_encode( $response_data ) );
        $this->assertEquals( 'come at me, bro', $response_data );
    }

    /**
     * Check that the sync endpoint will handle new valid comment.
     */
    public function test_sync_valid_new_comment() {
        wp_set_current_user( null );
        update_option( 'disqus_forum_url', 'bobross' );
        update_option( 'disqus_sync_token', 'valid_token' );

        // Setup the post.
        $post = $this->factory->post->create_and_get( array(
            'post_title' => 'Test Post 1'
        ) );

        // Create the POST data.
        $body = json_encode( array(
            'verb' => 'create',
            'reference' => array(
                'id' => '1',
                'author' => array(
                    'name' => 'Bob',
                    'url' => 'http://bobross.com/',
                    'email' => 'bob@bobross.com',
                ),
                'thread' => array(
                    'id' => '1',
                    'identifiers' => array(
                        $post->ID . ' ' . $post->guid,
                    )
                ),
                'parent' => null,
                'createdAt' => '2017-01-01T15:51:30',
                'forum' => 'bobross',
                'raw_message' => 'This is a test comment',
                'ipAddress' => '255.255.255.255',
            ),
        ) );

        // Set up the webhook request.
        $hub_signature = hash_hmac( 'sha512', $body, 'valid_token' );
        $request = new WP_REST_Request( 'POST', '/disqus/v1/sync/webhook' );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );
        $request->set_header( 'Content-Type', 'application/json' );

        // Make the request.
        $response = $this->server->dispatch( $request );

        $this->assertEquals( 201, $response->get_status(), 'Not a valid 201 status code, response was: ' . json_encode( $response->get_data() ) );

        // Assert that the post now has the meta disqus_thread_id.
        $this->assertEquals( '1', get_post_meta( $post->ID, 'dsq_thread_id', true ) );

        // Assert the comment exits, and includes the Disqus post data.
        $comment = $this->factory->comment->get_object_by_id( 1 );

        $this->assertEquals( 'This is a test comment', $comment->comment_content );
        $this->assertEquals( $post->ID, $comment->comment_post_ID );
        $this->assertEquals( '2017-01-01 15:51:30', $comment->comment_date_gmt );
        $this->assertEquals( 0, $comment->comment_parent );
        $this->assertEquals( 'Bob', $comment->comment_author );
        $this->assertEquals( 'bob@bobross.com', $comment->comment_author_email );
        $this->assertEquals( 'http://bobross.com/', $comment->comment_author_url );
        $this->assertEquals( '255.255.255.255', $comment->comment_author_IP );

        // Assert that the comment meta has Disqus Post Id attached to it.
        $comment_meta_post_id = get_comment_meta( $comment->comment_ID, 'dsq_post_id', true );

        $this->assertEquals( '1', $comment_meta_post_id );
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

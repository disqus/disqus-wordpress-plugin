<?php
/*
 * REST API Tests.
 */

class Test_REST_API_Settings extends WP_UnitTestCase {

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

    public function setUp() {
        parent::setUp();

        $this->admin_user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

        global $wp_rest_server;

        $this->server = $wp_rest_server = new \WP_REST_Server;

        do_action( 'rest_api_init' );
    }

    /**
     * Check that we can fetch the Disqus plugin settings as a WordPress admin.
     */
    public function test_admin_fetch_settings() {
        wp_set_current_user( $this->admin_user_id );

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
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

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
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

        $request = new WP_REST_Request( 'GET', DISQUS_REST_NAMESPACE . '/settings' );
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

        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/settings' );
        $request->set_body_params( $body );

        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();

        $this->assertEquals( 200, $response->get_status() );
        $this->assertEquals( 'rossbob', $response_data['data']['disqus_forum_url'] );
    }
}

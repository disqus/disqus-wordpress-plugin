<?php
/*
 * REST API Tests.
 */

/**
 *  See for how filter used: https://github.com/WordPress/WordPress/blob/master/wp-includes/class-http.php#L247
 */
function reflect_params( $preempt, $args, $url ) {
    // Simply return a json-encoded representation of the args that were passed.
    return array(
        'body' => json_encode( array(
            'code' => 0,
            'response' => array(
                'url' => $url,
                'args' => $args,
            ),
        ) ),
    );
}

function filter_http_force_error( $preempt, $args, $url ) {
    return new WP_Error( 'error', 'There was a generic error.' );
}

class Test_Api_Service extends WP_UnitTestCase {

    public function set_up() {
        parent::set_up();

        // Filter HTTP requests made from `wp_remote_get` and `wp_remote_post` so we don't actually call server.
        add_filter( 'pre_http_request', 'reflect_params', 1, 3 );
    }

    public function tear_down() {
        parent::tear_down();

        remove_filter( 'pre_http_request', 'reflect_params', 1 );
    }

    /**
     * Check that Disqus API GET requests include the secret key and access token without passing it explicitly.
     */
    public function test_api_get_tokens() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_get( 'forums/details', array() );

        $this->assertNotFalse( strpos( $api_data->response->url, 'forums/details.json' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'api_secret=APISECRETKEY' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'access_token=ACCESSTOKEN' ) );
    }

    /**
     * Check that Disqus API POST requests include the secret key and access token without passing it explicitly.
     */
    public function test_api_post_tokens() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_post( 'forums/update', array() );

        $this->assertNotFalse( strpos( $api_data->response->url, 'forums/update.json' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'api_secret=APISECRETKEY' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'access_token=ACCESSTOKEN' ) );
    }

    /**
     * Check that Disqus API GET requests include params that are passed in
     */
    public function test_api_get_with_args() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_get( 'forums/details', array(
            'forum' => 'bobross',
            'attach' => array( 'forumDaysAlive', 'forumFeatures' ),
        ) );

        $this->assertNotFalse( strpos( $api_data->response->url, 'forum=bobross' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'attach=forumDaysAlive' ) );
        $this->assertNotFalse( strpos( $api_data->response->url, 'attach=forumFeatures' ) );
    }

    /**
     * Check that Disqus API GET requests include params that are passed in
     */
    public function test_api_post_with_args() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_post( 'forums/update', array(
            'forum' => 'bobross',
            'name' => 'Ross Bob',
            'attach' => array( 'forumDaysAlive', 'forumFeatures' ),
        ) );

        $this->assertObjectHasAttribute( 'name', $api_data->response->args->body );
        $this->assertEquals( 'Ross Bob', $api_data->response->args->body->name );

        $this->assertObjectHasAttribute( 'attach', $api_data->response->args->body );
        $this->assertTrue( is_array( $api_data->response->args->body->attach ) );
    }

    /**
     * Check that Disqus API POST requests have no referer.
     */
    public function test_api_post_no_referer() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_post( 'forums/details', array() );

        $this->assertEquals( '', $api_data->response->args->headers->Referer );
    }

    /**
     * Check that the Disqus API returns a proper error.
     */
    public function test_api_error() {
        remove_filter( 'pre_http_request', 'reflect_params', 1 );
        add_filter( 'pre_http_request', 'filter_http_force_error', 1, 3 );

        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_get( 'forums/details', array(
            'forum' => 'bobross',
            'attach' => array( 'forumDaysAlive', 'forumFeatures' ),
        ) );

        $this->assertGreaterThan( 0, $api_data->code );
        $this->assertEquals( 'There was a generic error.', $api_data->response );

        remove_filter( 'pre_http_request', 'filter_http_force_error', 1 );
    }
}

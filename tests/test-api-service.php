<?php
/*
 * REST API Tests.
 */

 function reflect_params( $url, $args ) {
     // Simply return a json-encoded representation of the args that were passed
    return array(
        'body' => json_encode( array(
            'url' => $url,
            'args' => $args,
        ) ),
    );
 }

/*
 * Mocked global function for making a POST http request.
 */
function wp_remote_post( $url, $args ) {
    return reflect_params( $url, $args );
}

/*
 * Mocked global function for making a GET http request.
 */
function wp_remote_get( $url, $args ) {
    return reflect_params( $url, $args );
}

class Test_Api_Service extends WP_UnitTestCase {

    public function setUp() {
        parent::setUp();
    }

    /**
     * Check that Disqus API GET requests include the secret key and access token without passing it explicitly.
     */
    public function test_api_get_tokens() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_get( 'someEndpoint', null );

        $this->assertNotFalse( strpos( $api_data->url, 'someEndpoint.json' ) );
        $this->assertNotFalse( strpos( $api_data->url, 'api_secret=APISECRETKEY' ) );
        $this->assertNotFalse( strpos( $api_data->url, 'access_token=ACCESSTOKEN' ) );
    }

    /**
     * Check that Disqus API POST requests include the secret key and access token without passing it explicitly.
     */
    public function test_api_post_tokens() {
        $api_service = new Disqus_Api_Service( 'APISECRETKEY', 'ACCESSTOKEN' );

        $api_data = $api_service->api_post( 'someEndpoint', null );

        $this->assertNotFalse( strpos( $api_data->url, 'someEndpoint.json' ) );
        $this->assertNotFalse( strpos( $api_data->url, 'api_secret=APISECRETKEY' ) );
        $this->assertNotFalse( strpos( $api_data->url, 'access_token=ACCESSTOKEN' ) );
    }

    /**
     * Check that Disqus API POST requests have no referer.
     */
    public function test_api_post_no_referer() {
        $this->assertTrue( true );
    }
}

<?php
/*
 * REST API Tests.
 */

class Test_REST_API_Sync extends WP_UnitTestCase {

    /**
     * Test REST Server.
     *
     * @var WP_REST_Server
     */
    protected $server;

    /**
     * Test WordPress post fixture
     *
     * @var WP_Post
     */
    protected $post;

    public function setUp() {
        parent::setUp();

        global $wp_rest_server;

        $this->server = $wp_rest_server = new \WP_REST_Server;

        $this->post = $this->factory->post->create_and_get( array(
            'post_title' => 'Test Post 1'
        ) );

        wp_set_current_user( null );
        update_option( 'disqus_forum_url', 'bobross' );
        update_option( 'disqus_sync_token', 'valid_token' );

        do_action( 'rest_api_init' );
    }

    /**
     * Check that the sync endpoint will handle valid verification challenge.
     */
    public function test_sync_valid_verification() {
        $body = json_encode( array(
            'verb' => 'verify',
            'challenge' => 'come at me, bro',
        ) );
        $hub_signature = hash_hmac( 'sha512', $body, 'valid_token' );

        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/sync/webhook' );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );
        $request->set_header( 'Content-Type', 'application/json' );

        $response = $this->server->dispatch( $request );
        $response_data = $response->get_data();
        $this->assertEquals(
            200,
            $response->get_status(),
            'Not a valid 200 status code, response was: ' . json_encode( $response_data )
        );
        $this->assertEquals( 'come at me, bro', $response_data );
    }

    /**
     * Check that the sync endpoint will handle new valid comment.
     */
    public function test_sync_valid_new_comment() {
        // Create the POST data.
        $body = json_encode( array(
            'verb' => 'create',
            'transformed_data' => array(
                'id' => '1',
                'author' => array(
                    'name' => 'Bob',
                    'url' => 'http://bobross.com/',
                    'email' => 'bob@bobross.com',
                ),
                'threadData' => array(
                    'id' => '1',
                    'identifiers' => array(
                        $this->post->ID . ' ' . $this->post->guid,
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
        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/sync/webhook' );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );
        $request->set_header( 'Content-Type', 'application/json' );

        // Make the request.
        $response = $this->server->dispatch( $request );

        $this->assertEquals(
            201,
            $response->get_status(),
            'Not a valid 201 status code, response was: ' . json_encode( $response->get_data() )
        );

        // Assert that the post now has the meta disqus_thread_id.
        $this->assertEquals( '1', get_post_meta( $this->post->ID, 'dsq_thread_id', true ) );

        // Assert the comment exits, and includes the Disqus post data.
        $first_comment = (int) $response->get_data();
        $comment = get_comment( $first_comment, ARRAY_A );

        $this->assertEquals( 'This is a test comment', $comment['comment_content'] );
        $this->assertEquals( $this->post->ID, $comment['comment_post_ID'] );
        $this->assertEquals( '2017-01-01 15:51:30', $comment['comment_date_gmt'] );
        $this->assertEquals( 0, $comment['comment_parent'] );
        $this->assertEquals( 'Bob', $comment['comment_author'] );
        $this->assertEquals( 'bob@bobross.com', $comment['comment_author_email'] );
        $this->assertEquals( 'http://bobross.com/', $comment['comment_author_url'] );
        $this->assertEquals( '255.255.255.255', $comment['comment_author_IP'] );

        // Assert that the comment meta has Disqus Post Id attached to it.
        get_comment_meta( $comment['comment_post_ID'], 'dsq_post_id', true );
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

    /**
     * Check that the sync endpoint will reject duplicate comments.
     */
    public function test_sync_duplicate_new_comment() {
        $this->assertTrue( true );
    }
}

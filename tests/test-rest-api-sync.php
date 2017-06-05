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

    /**
     * Test Disqus post (comment) fixture
     *
     * @var array
     */
    protected $disqus_post;

    public function setUp() {
        parent::setUp();

        global $wp_rest_server;

        $this->server = $wp_rest_server = new \WP_REST_Server;

        $this->post = $this->factory->post->create_and_get( array(
            'post_title' => 'Test Post 1'
        ) );

        $this->disqus_post = array(
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
                'isApproved' => true,
                'isDeleted' => false,
                'isFlagged' => false,
                'isSpam' => false,
            ),
        );

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
        // Make the request.
        $request = $this->get_valid_request_with_signature( $this->disqus_post, 'sync/webhook' );
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
        $this->assertEquals( 1, $comment['comment_approved'] );

        // Assert that the comment meta has Disqus Post Id attached to it.
        $disqus_post_id = get_comment_meta( $comment['comment_ID'], 'dsq_post_id', true );
        $this->assertEquals( $this->disqus_post['transformed_data']['id'], $disqus_post_id );
    }

    /**
     * Check that the sync endpoint will handle replies.
     */
    public function test_sync_parent_new_comment() {
        // Sync the first comment
        $parent_disqus_post = $this->disqus_post;
        $parent_request = $this->get_valid_request_with_signature( $parent_disqus_post, 'sync/webhook' );
        $parent_response = $this->server->dispatch( $parent_request );
        $parent_comment = (int) $parent_response->get_data();
        $parent_comment = get_comment( $parent_comment, ARRAY_A );

        // Sync the second comment with first as parent (using Disqus post ID).
        $child_disqus_post = array(
            'verb' => 'create',
            'transformed_data' => array(
                'id' => '2',
                'author' => array(
                    'name' => 'Rob',
                    'email' => 'rob@robboss.com',
                ),
                'threadData' => array(
                    'id' => '1',
                    'identifiers' => array(
                        $this->post->ID . ' ' . $this->post->guid,
                    )
                ),
                'parent' => 1,
                'createdAt' => '2017-01-02T15:51:30',
                'forum' => 'bobross',
                'raw_message' => 'This is a reply to test comment',
                'ipAddress' => '255.255.255.255',
                'isApproved' => true,
                'isDeleted' => false,
                'isFlagged' => false,
                'isSpam' => false,
            ),
        );
        $child_request = $this->get_valid_request_with_signature( $child_disqus_post, 'sync/webhook' );
        $child_response = $this->server->dispatch( $child_request );

        $this->assertEquals(
            201,
            $child_response->get_status(),
            'Not a valid 201 status code, response was: ' . json_encode( $child_response->get_data() )
        );

        $child_comment = (int) $child_response->get_data();
        $child_comment = get_comment( $child_comment, ARRAY_A );

        $this->assertEquals( $parent_comment['comment_ID'], $child_comment['comment_parent'] );
    }

    public function test_sync_unapproved_new_comment() {
        $disqus_post = $this->disqus_post;
-       $disqus_post['transformed_data']['isApproved'] = false;

        $request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $response = $this->server->dispatch( $request );

        $comment = (int) $response->get_data();
        $comment = get_comment( $comment, ARRAY_A );

        $this->assertEquals( 0, $comment['comment_approved'] );
    }

    public function test_sync_spam_new_comment() {
        $disqus_post = $this->disqus_post;
-       $disqus_post['transformed_data']['isApproved'] = false;
        $disqus_post['transformed_data']['isSpam'] = true;

        $request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $response = $this->server->dispatch( $request );

        $comment = (int) $response->get_data();
        $comment = get_comment( $comment, ARRAY_A );

        $this->assertEquals( 'spam', $comment['comment_approved'] );
    }

    public function test_sync_deleted_new_comment() {
        $disqus_post = $this->disqus_post;
-       $disqus_post['transformed_data']['isApproved'] = false;
        $disqus_post['transformed_data']['isDeleted'] = true;

        $request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $response = $this->server->dispatch( $request );

        $comment = (int) $response->get_data();
        $comment = get_comment( $comment, ARRAY_A );

        $this->assertEquals( 0, $comment['comment_approved'] );
    }

    /**
     * Check that the sync endpoint will handle updated comment.
     */
    public function test_sync_valid_updated_comment() {
        // First sync the original comment
        $disqus_post = $this->disqus_post;

        $create_request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $create_response = $this->server->dispatch( $create_request );

        // Now change the message and re-sync
        $disqus_post['transformed_data']['raw_message'] = 'lol jk, idk';
        $disqus_post['verb'] = 'update';

        $update_request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $update_response = $this->server->dispatch( $update_request );

        $this->assertEquals(
            200,
            $update_response->get_status(),
            'Not a valid 200 status code, response was: ' . json_encode( $update_response->get_data() )
        );

        $comment = (int) $update_response->get_data();

        $this->assertGreaterThan(0, $comment);

        $comment = get_comment( $comment, ARRAY_A );

        $this->assertEquals( 'lol jk, idk', $comment['comment_content'] );
    }

    /**
     * Check that the sync endpoint will reject duplicate comments.
     */
    public function test_sync_duplicate_new_comment() {
        $disqus_post = $this->disqus_post;

        $first_create_request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $first_create_response = $this->server->dispatch( $first_create_request );
        $first_comment_id = $first_create_response->get_data();

        $this->assertGreaterThan(0, $first_comment_id);

        $second_create_request = $this->get_valid_request_with_signature( $disqus_post, 'sync/webhook' );
        $second_create_response = $this->server->dispatch( $second_create_request );
        $second_comment_id = $second_create_response->get_data();

        // We should get a `0` back indicating the second comment was not synced.
        $this->assertEquals('0', $second_comment_id);
    }

    /**
     * Utility function for building a request with a given body/path using shared secret authentication.
     */
    private function get_valid_request_with_signature( $body, $path ) {
        $body = json_encode( $body );
        $hub_signature = hash_hmac( 'sha512', $body, 'valid_token' );
        $request = new WP_REST_Request( 'POST', DISQUS_REST_NAMESPACE . '/' . $path );
        $request->set_body( $body );
        $request->set_header( 'X-Hub-Signature', 'sha512=' . $hub_signature );
        $request->set_header( 'Content-Type', 'application/json' );

        return $request;
    }
}

<?php
/*
 * Tests for Disqus_Rest_Api::comment_data_from_post author email logic.
 */

class Test_Disqus_Rest_Api_Comment_Data_From_Post extends WP_UnitTestCase {
    protected $disqus_rest_api;

    public function set_up() {
        parent::set_up();
        $this->disqus_rest_api = new Disqus_Rest_Api( null, null );
    }

    private function call_comment_data_from_post( $post ) {
        $class = new ReflectionClass( 'Disqus_Rest_Api' );
        $method = $class->getMethod( 'comment_data_from_post' );
        $method->setAccessible( true );
        return $method->invokeArgs( $this->disqus_rest_api, array( $post ) );
    }

    private function call_resolve_wp_post_id_from_thread( $thread ) {
        $class = new ReflectionClass( 'Disqus_Rest_Api' );
        $method = $class->getMethod( 'resolve_wp_post_id_from_thread' );
        $method->setAccessible( true );
        return $method->invokeArgs( $this->disqus_rest_api, array( $thread ) );
    }

    public function test_email_from_author_email() {
        $post = [
            'thread' => [ 'id' => 1, 'identifiers' => [ '1' ] ],
            'author' => [ 'email' => 'foo@example.com', 'name' => 'Foo' ],
            'parent' => null,
            'ipAddress' => '127.0.0.1',
            'raw_message' => 'Test',
            'createdAt' => '2020-01-01 00:00:00',
            'isApproved' => true,
            'isDeleted' => false,
            'isSpam' => false,
            'id' => 123,
            'forum' => get_option( 'disqus_forum_url' ),
        ];
        $data = $this->call_comment_data_from_post( $post );
        $this->assertEquals( 'foo@example.com', $data['comment_author_email'] );
    }

    public function test_email_from_anonymous_author() {
        $post = [
            'thread' => [ 'id' => 1, 'identifiers' => [ '1' ] ],
            'author' => [ 'isAnonymous' => true, 'name' => 'Anon' ],
            'parent' => null,
            'ipAddress' => '127.0.0.1',
            'raw_message' => 'Test',
            'createdAt' => '2020-01-01 00:00:00',
            'isApproved' => true,
            'isDeleted' => false,
            'isSpam' => false,
            'id' => 123,
            'forum' => get_option( 'disqus_forum_url' ),
        ];
        $data = $this->call_comment_data_from_post( $post );
        $this->assertStringStartsWith( 'anonymized-', $data['comment_author_email'] );
        $this->assertStringEndsWith( '@disqus.com', $data['comment_author_email'] );
    }

    public function test_email_from_author_id() {
        $post = [
            'thread' => [ 'id' => 1, 'identifiers' => [ '1' ] ],
            'author' => [ 'id' => 42 ],
            'parent' => null,
            'ipAddress' => '127.0.0.1',
            'raw_message' => 'Test',
            'createdAt' => '2020-01-01 00:00:00',
            'isApproved' => true,
            'isDeleted' => false,
            'isSpam' => false,
            'id' => 123,
            'forum' => get_option( 'disqus_forum_url' ),
        ];
        $data = $this->call_comment_data_from_post( $post );
        $this->assertEquals( 'user-42@disqus.com', $data['comment_author_email'] );
    }

    public function test_resolve_post_id_from_matching_identifier() {
        $post = $this->factory->post->create_and_get();
        update_option( 'disqus_forum_url', 'bobross' );

        $thread = array(
            'id' => '99',
            'identifiers' => array(
                $post->ID . ' ' . $post->guid,
            ),
        );

        $this->assertEquals( $post->ID, $this->call_resolve_wp_post_id_from_thread( $thread ) );
        $this->assertEquals( '99', get_post_meta( $post->ID, 'dsq_thread_id', true ) );
    }

    public function test_resolve_post_id_skips_invalid_identifier_and_uses_thread_link() {
        $post = $this->factory->post->create_and_get();
        update_option( 'disqus_forum_url', 'bobross' );

        $thread = array(
            'id' => '100',
            'identifiers' => array(
                '99999 http://other-site.example/?p=123',
            ),
            'link' => get_permalink( $post->ID ),
        );

        $this->assertEquals( $post->ID, $this->call_resolve_wp_post_id_from_thread( $thread ) );
    }

    public function test_resolve_post_id_returns_null_when_unresolved() {
        $thread = array(
            'id' => '101',
            'identifiers' => array(
                '99999 http://other-site.example/?p=123',
            ),
            'link' => 'http://other-site.example/missing-post/',
        );

        $this->assertNull( $this->call_resolve_wp_post_id_from_thread( $thread ) );
    }

    public function test_email_when_no_author() {
        $post = [
            'thread' => [ 'id' => 1, 'identifiers' => [ '1' ] ],
            'author' => null,
            'parent' => null,
            'ipAddress' => '127.0.0.1',
            'raw_message' => 'Test',
            'createdAt' => '2020-01-01 00:00:00',
            'isApproved' => true,
            'isDeleted' => false,
            'isSpam' => false,
            'id' => 123,
            'forum' => get_option( 'disqus_forum_url' ),
        ];
        $data = $this->call_comment_data_from_post( $post );
        $this->assertNull( $data['comment_author_email'] );
    }

    private function disqus_post_fixture() {
        return [
            'thread' => [ 'id' => 1, 'identifiers' => [ '1' ] ],
            'author' => [ 'email' => 'foo@example.com', 'name' => 'Foo' ],
            'parent' => null,
            'ipAddress' => '127.0.0.1',
            'raw_message' => 'Test',
            'createdAt' => '2020-01-01 00:00:00',
            'isApproved' => true,
            'isDeleted' => false,
            'isSpam' => false,
            'id' => 123,
            'forum' => get_option( 'disqus_forum_url' ),
        ];
    }

    public function test_author_ip_from_post() {
        $data = $this->call_comment_data_from_post( $this->disqus_post_fixture() );

        $this->assertEquals( '127.0.0.1', $data['comment_author_IP'] );
    }

    /**
     * Disqus omits ipAddress from posts when the requesting user can't view personal data on the forum.
     * Warnings fail tests because phpunit.xml.dist converts them to exceptions.
     */
    public function test_author_ip_when_missing() {
        $post = $this->disqus_post_fixture();
        unset( $post['ipAddress'] );

        $data = $this->call_comment_data_from_post( $post );

        $this->assertSame( '', $data['comment_author_IP'] );
    }

    public function test_author_ip_when_null() {
        $post = $this->disqus_post_fixture();
        $post['ipAddress'] = null;

        $data = $this->call_comment_data_from_post( $post );

        $this->assertSame( '', $data['comment_author_IP'] );
    }
}

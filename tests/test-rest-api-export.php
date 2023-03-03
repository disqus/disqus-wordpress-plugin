<?php
/*
 * REST API Comment Export Tests.
 */

class Test_REST_API_Export extends WP_UnitTestCase {

    /**
     * Test REST Server.
     *
     * @var WP_REST_Server
     */
    protected $server;

    /**
     * Disqus REST API instance
     *
     * @var Disqus_Rest_Api
     */
    protected $disqus_rest_api;

    /**
     * Test WordPress post fixture
     *
     * @var WP_Post
     */
    protected $post;

    /**
     * Test WordPress comment fixture
     *
     * @var WP_Comment
     */
    protected $comment;

    /**
     * User ID for 'administrator' role.
     *
     * @var int
     */
    private $admin_user_id;

    public function is_comment_exportable( $comment ) {
        $class = new ReflectionClass('Disqus_Rest_Api');
        $method = $class->getMethod('is_comment_exportable');
        $method->setAccessible(true);
        return $method->invokeArgs( $this->disqus_rest_api, array( $comment ));
    }

    public function set_up() {
        parent::set_up();

        $this->post = get_post( $this->factory->post->create() );

        $this->comment = get_comment(
            $this->factory->comment->create(
                array (
                    'comment_post_ID' => $this->post->ID
                )
            )
        );

        $this->disqus_rest_api = new Disqus_Rest_Api(null, null);
    }

    /**
     * Test that the default comment is exportable.
     */
    public function test_default_comment_is_exportable() {
        $this->assertTrue( $this->is_comment_exportable( $this->comment ) );
    }

    /**
     * Test that a comment synced from Disqus is not exportable.
     */
    public function test_disqus_comment_is_not_exportable() {
        $disqus_comment = get_comment(
            $this->factory->comment->create(
                array (
                    'comment_post_ID' => $this->post->ID,
                    'comment_agent' => 'Disqus Sync Host'
                )
            )
        );

        $this->assertFalse( $this->is_comment_exportable( $disqus_comment ) );
    }
}
<?php
/*
 * Tests for the comments list table response column fallback.
 */

class Test_Disqus_Comments_List_Table extends WP_UnitTestCase {

    /**
     * Test WordPress post fixture
     *
     * @var WP_Post
     */
    protected $post;

    public function set_up() {
        parent::set_up();

        require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-comments-list-table.php';
        require_once dirname( __DIR__ ) . '/disqus/admin/class-disqus-comments-list-table.php';

        set_current_screen( 'edit-comments' );
        wp_set_current_user( $this->factory->user->create( array( 'role' => 'administrator' ) ) );

        $this->post = $this->factory->post->create_and_get( array(
            'post_title' => 'Test Post 1',
        ) );
    }

    public function tear_down() {
        unset( $GLOBALS['post'] );
        parent::tear_down();
    }

    private function render_response_column( $comment_id ) {
        $table = new Disqus_Comments_List_Table( array( 'screen' => 'edit-comments' ) );

        ob_start();
        $table->column_response( get_comment( $comment_id ) );
        return ob_get_clean();
    }

    public function test_response_column_uses_post_when_resolved() {
        $comment_id = wp_insert_comment( array(
            'comment_post_ID' => $this->post->ID,
            'comment_content' => 'A synced comment',
            'comment_approved' => 1,
            'comment_agent' => 'Disqus Sync Host',
        ) );

        $GLOBALS['post'] = $this->post;

        $output = $this->render_response_column( $comment_id );

        $this->assertStringContainsString( 'Test Post 1', $output );
    }

    public function test_response_column_falls_back_to_thread_link() {
        $comment_id = wp_insert_comment( array(
            'comment_post_ID' => 0,
            'comment_content' => 'An orphaned synced comment',
            'comment_approved' => 1,
            'comment_agent' => 'Disqus Sync Host',
        ) );
        add_comment_meta( $comment_id, 'dsq_thread_link', 'http://other-site.example/a-thread/' );
        add_comment_meta( $comment_id, 'dsq_thread_title', 'A thread on another site' );

        $output = $this->render_response_column( $comment_id );

        $this->assertStringContainsString( 'http://other-site.example/a-thread/', $output );
        $this->assertStringContainsString( 'A thread on another site', $output );
    }

    public function test_response_column_falls_back_to_url_without_title() {
        $comment_id = wp_insert_comment( array(
            'comment_post_ID' => 0,
            'comment_content' => 'An orphaned synced comment',
            'comment_approved' => 1,
            'comment_agent' => 'Disqus Sync Host',
        ) );
        add_comment_meta( $comment_id, 'dsq_thread_link', 'http://other-site.example/a-thread/' );

        $output = $this->render_response_column( $comment_id );

        $this->assertStringContainsString( 'http://other-site.example/a-thread/', $output );
    }

    public function test_response_column_is_empty_without_thread_details() {
        $comment_id = wp_insert_comment( array(
            'comment_post_ID' => 0,
            'comment_content' => 'An orphaned comment',
            'comment_approved' => 1,
        ) );

        $this->assertEquals( '', $this->render_response_column( $comment_id ) );
    }

    public function test_response_column_ignores_stale_global_post() {
        $comment_id = wp_insert_comment( array(
            'comment_post_ID' => 0,
            'comment_content' => 'An orphaned synced comment',
            'comment_approved' => 1,
            'comment_agent' => 'Disqus Sync Host',
        ) );
        add_comment_meta( $comment_id, 'dsq_thread_link', 'http://other-site.example/a-thread/' );

        // WordPress leaves the previous row's post in the global when a comment has no post.
        $GLOBALS['post'] = $this->post;

        $output = $this->render_response_column( $comment_id );

        $this->assertStringNotContainsString( 'Test Post 1', $output );
    }
}

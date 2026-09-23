<?php
/**
 * The comments list table used in the WordPress admin.
 *
 * @link       https://disqus.com
 * @since      3.1.5
 *
 * @package    Disqus
 * @subpackage Disqus/admin
 */

/**
 * Extends the WordPress comments list table so that synced comments which
 * couldn't be matched to a WordPress post still link to their Disqus thread.
 *
 * @package    Disqus
 * @subpackage Disqus/admin
 */
class Disqus_Comments_List_Table extends WP_Comments_List_Table {

    /**
     * Outputs the response column, falling back to the Disqus thread.
     *
     * @since    3.1.5
     * @param    WP_Comment $comment    The comment object.
     */
    public function column_response( $comment ) {
        if ( $comment->comment_post_ID && get_post( $comment->comment_post_ID ) ) {
            parent::column_response( $comment );
            return;
        }

        $thread_link = get_comment_meta( $comment->comment_ID, 'dsq_thread_link', true );

        if ( ! $thread_link ) {
            return;
        }

        $thread_title = get_comment_meta( $comment->comment_ID, 'dsq_thread_title', true );

        echo '<div class="response-links">';
        printf(
            '<a href="%s" class="comments-view-item-link" target="_blank" rel="noopener noreferrer">%s</a>',
            esc_url( $thread_link ),
            esc_html( $thread_title ? $thread_title : $thread_link )
        );
        echo '</div>';
    }
}

<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 * @author     Your Name <email@example.com>
 */
class Disqus_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $disqus    The ID of this plugin.
	 */
	private $disqus;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $disqus       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $disqus, $version ) {
		$this->disqus = $disqus;
		$this->version = $version;
		$this->shortname = strtolower( get_option( 'disqus_forum_url' ) );
	}

	private function dsq_identifier_for_post( $post ) {
		return $post->ID . ' ' . $post->guid;
	}

	private function dsq_title_for_post( $post ) {
		$title = get_the_title( $post );
    	$title = strip_tags( $title, '<b><u><i><h1><h2><h3><code><blockquote><br><hr>' );
    	return $title;
	}

	private function embed_vars_for_post( $post ) {
		return array(
			'disqusConfig' => array(
				'platform' => 'wordpress',
				//'language' => apply_filters( 'disqus_language_filter', '' ),
			),
			'disqusIdentifier' => $this->dsq_identifier_for_post( $post ),
			'disqusShortname' => $this->shortname,
			'disqusTitle' => $this->dsq_title_for_post( $post ),
			'disqusUrl' => get_permalink(),
			'postId' => $post->ID,
		);
	}

	private function count_vars() {
		return array(
			'disqusShortname' => $this->shortname,
		);
	}

	private function dsq_can_load() {
		if ( !$this->shortname )
			return false;

		if ( is_feed() )
			return false;

		return true;
	}

	private function dsq_can_load_for_post( $post ) {
		if ( !$this->dsq_can_load() )
			return false;

		if ( !isset( $post ) )
			return false;

		if ( 'draft' == $post->post_status )
			return false;

		return true;
	}

	private function load_comment_count() {
		if ( !$this->dsq_can_load() )
			return;

		$count_vars = $this->count_vars();
		wp_enqueue_script( $this->disqus . '_count', plugin_dir_url( __FILE__ ) . 'js/comment_count.js', array(), $this->version, true );

		wp_localize_script( $this->disqus . '_count', 'countVars', $count_vars );
	}

	private function load_comment_embed() {
		add_filter( 'comments_template', array( $this, 'dsq_comments_template') );
	}

	public function dsq_comments_template() {
		global $post;

		$embed_vars = $this->embed_vars_for_post( $post );

		wp_enqueue_script( $this->disqus . '_embed', plugin_dir_url( __FILE__ ) . 'js/comment_embed.js', array(), $this->version, true );
		wp_localize_script( $this->disqus . '_embed', 'embedVars', $embed_vars );

		return plugin_dir_path( dirname( __FILE__ ) ) . 'public/partials/disqus-public-display.php';
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		global $post;

		if ( !$this->dsq_can_load_for_post( $post ) )
			return;

		$this->load_comment_count();
		$this->load_comment_embed();
	}


}

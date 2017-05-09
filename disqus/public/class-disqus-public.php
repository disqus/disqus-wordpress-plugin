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
	public function __construct( $disqus, $version, $shortname ) {
		$this->disqus = $disqus;
		$this->version = $version;
		$this->shortname = $shortname;
	}

	private function dsq_identifier_for_post( $post ) {
		return $post->ID . ' ' . $post->guid;
	}

	private function dsq_title_for_post( $post ) {
		$title = get_the_title( $post );
    	$title = strip_tags( $title, '<b><u><i><h1><h2><h3><code><blockquote><br><hr>' );
    	return $title;
	}

	private function remote_auth_s3_for_user( $user, $secret_key ) {
		$payload_user = array();
		if ( $user->ID ) {
			$payload_user['id'] = $user->ID;
			$payload_user['username'] = $user->display_name;
			$payload_user['avatar'] = get_avatar( $user->ID, 92 );
			$payload_user['email'] = $user->user_email;
			$payload_user['url'] = $user->user_url;
		}
		$payload_user = base64_encode( json_encode( $payload_user ) );
		$time = time();
		$hmac = hash_hmac( 'sha1', $payload_user . ' ' . $time, $secret_key );

		return $payload_user . ' ' . $hmac . ' ' . $time;
	}

	private function embed_vars_for_post( $post ) {
		$embed_vars = array(
			'disqusConfig' => array(
				'platform' => 'wordpress',
			),
			'disqusIdentifier' => $this->dsq_identifier_for_post( $post ),
			'disqusShortname' => $this->shortname,
			'disqusTitle' => $this->dsq_title_for_post( $post ),
			'disqusUrl' => get_permalink(),
			'postId' => $post->ID,
		);

		$public_key = get_option( 'disqus_public_key' );
		$secret_key = get_option( 'disqus_secret_key' );
		$can_enable_sso = $public_key && $secret_key && get_option( 'disqus_sso_enabled' );
		if ( $can_enable_sso ) {
			$user = wp_get_current_user();
			$login_redirect = get_admin_url( null, 'profile.php?opener=dsq-sso-login' );
			$embed_vars['disqusConfig']['sso'] = array(
				'name' => esc_js( get_bloginfo( 'name' ) ),
				'button' => esc_js( get_option( 'disqus_sso_button' ) ),
				'url' => wp_login_url( $login_redirect ),
				'logout' => wp_logout_url(),
				'width' => '800',
				'height' => '700',
			);
			$embed_vars['disqusConfig']['api_key'] = $public_key;
			$embed_vars['disqusConfig']['remote_auth_s3'] = $this->remote_auth_s3_for_user( $user,  $secret_key );
		}

		return $embed_vars;
	}

	public function dsq_comments_link_template( $comment_text ) {
		global $post;

		if ( $this->dsq_can_load() ) {
			$disqus_identifier = esc_attr( $this->dsq_identifier_for_post( $post ) );
			return '<span class="dsq-postid" data-dsqidentifier="' . $disqus_identifier . '">'
						. $comment_text .
				   '</span>';
		} else {
			return $comment_text;
		}
	}

	public function dsq_comments_template() {
		global $post;

		if ( $this->dsq_embed_can_load_for_post( $post ) ) {

			do_action( 'dsq_before_comments' );
			do_action( 'dsq_enqueue_comments_script' );

			return plugin_dir_path( dirname( __FILE__ ) ) . 'public/partials/disqus-public-display.php';
		}
	}

	/**
	 * Renders a script which checks to see if the window was opened
	 * by the Disqus embed for Single Sign-on purposes, and closes
	 * itself.
	 *
	 * @since    1.0.0
	*/
	public function dsq_close_window_template() {
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/partials/disqus-public-sso-login-profile.php';
	}

	public function enqueue_comment_count() {
		if ( $this->dsq_can_load() ) {

			$count_vars = array(
				'disqusShortname' => $this->shortname,
			);

			wp_enqueue_script( $this->disqus . '_count', plugin_dir_url( __FILE__ ) . 'js/comment_count.js', array(), $this->version, true );
			wp_localize_script( $this->disqus . '_count', 'countVars', $count_vars );
		}
	}

	public function enqueue_comment_embed() {
		global $post;

		if ( $this->dsq_embed_can_load_for_post( $post ) ) {

			$embed_vars = $this->embed_vars_for_post( $post );

			wp_enqueue_script( $this->disqus . '_embed', plugin_dir_url( __FILE__ ) . 'js/comment_embed.js', array(), $this->version, true );
			wp_localize_script( $this->disqus . '_embed', 'embedVars', $embed_vars );
		}
	}

	private function dsq_can_load() {
		// Don't load any Disqus scripts if there's no shortname
		if ( !$this->shortname )
			return false;

		// Don't load any Disqus scripts on feed pages
		if ( is_feed() )
			return false;

		return true;
	}

	private function dsq_embed_can_load_for_post( $post ) {
		// Checks if the plugin is configured properly
		// and is a valid page.
		if ( !$this->dsq_can_load() )
			return false;

		// Make sure we have a $post object
		if ( !isset( $post ) )
			return false;

		// Don't load embed when post is a draft
		if ( 'draft' == $post->post_status )
			return false;

		// Don't load embed when comments are closed on a post
		if ( 'open' != $post->comment_status )
			return false;

		// Don't load embed if it's not a single post page
		if ( !is_singular() )
			return false;

		return true;
	}
}

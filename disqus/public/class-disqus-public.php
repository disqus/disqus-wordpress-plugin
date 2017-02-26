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

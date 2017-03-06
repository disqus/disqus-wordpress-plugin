<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Disqus
 * @subpackage Disqus/admin
 * @author     Ryan Valentin <ryan@disqus.com>
 */
class Disqus_Admin {

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
	 * The unique Disqus forum shortname.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $shortname    The unique Disqus forum shortname.
	 */
	private $shortname;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $disqus       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $disqus, $version, $shortname ) {

		$this->disqus = $disqus;
		$this->version = $version;
		$this->shortname = $shortname;
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Disqus_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Disqus_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->disqus, plugin_dir_url( __FILE__ ) . 'css/disqus-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Disqus_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Disqus_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->disqus, plugin_dir_url( __FILE__ ) . 'js/disqus-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Builds the admin toolbar menu with the various Disqus options
	 *
	 * @since    1.0.0
	 */
	public function dsq_contruct_admin_menu() {
		// Replace the existing WordPress comments menu item to prevent confusion
		// about where to administer comments. The Disqus page will have a link to
		// see WordPress comments.
		if ( current_user_can ( 'moderate_comments' )  ) {
			remove_menu_page( 'edit-comments.php' );
			add_menu_page( 'Disqus', 'Disqus', 'moderate_comments', 'disqus', array( $this, 'dsq_render_admin_index' ), 'dashicons-admin-comments', 24 );
		}
	}

	/**
	 * Builds the admin menu with the various Disqus options
	 *
	 * @since    1.0.0
	 */
	public function dsq_construct_admin_bar_menu( $wp_admin_bar ) {
		// Replace the existing WordPress comments menu item to prevent confusion
		// about where to administer comments. The Disqus page will have a link to
		// see WordPress comments.
		if ( current_user_can ( 'moderate_comments' )  ) {
			$wp_admin_bar->remove_node( 'wp-admin-bar-comments' );

			$new_node_args = array(
				'id' => 'disqus',
				'title' => 'Disqus',
				'href' => 'https://disqus.com/',
				'meta' => array(
					'class' => 'disqus-menu-bar'
				)
			);

			$wp_admin_bar->add_node( $new_node_args );
		}
	}

	private function get_admin_url_for_forum( $path ) {
		return 'https://' . $this->shortname . '.disqus.com/admin/' . $path . '/';
	}

	/**
	 * Renders the admin page view from a partial file
	 *
	 * @since    1.0.0
	 */
	public function dsq_render_admin_index() {
		$post_message = null;

		if ( 'POST' === $_SERVER['REQUEST_METHOD'] && !empty( $_POST ) ) {

			// Verify nonce/referrer
			if ( !check_admin_referer( 'dsq_admin_nonce', 'dsq_admin_nonce' ) ) {
				dsq_gettext_e( 'This request is not valid.' );
				exit;
			}

			// Site confirguration form
		    if ( isset( $_REQUEST['submit-site-form'] ) ) {
		    	$normalized_shortname = preg_replace( '/\s\s+/', '', strtolower( $_POST['disqus_forum_url'] ) );
		        update_option( 'disqus_forum_url', $normalized_shortname );
				$this->shortname = $normalized_shortname;

				$post_message = dsq_gettext( 'Your settings have been updated.' );
		    }

			// SSO configuration form
			if ( isset( $_REQUEST['submit-sso-form'] ) ) {
				update_option( 'disqus_sso_enabled', isset( $_POST['disqus_sso_enabled'] ) );

				$sso_options = array (
					'disqus_public_key',
					'disqus_secret_key',
					'disqus_sso_button'
				);
				foreach ($sso_options as $opt) {
					if ( isset( $_POST[$opt] ) ) {
						update_option( $opt, esc_js( $_POST[$opt] ) );
					}
				}

				$post_message = dsq_gettext( 'Your settings have been updated.' );
			}
		}

		// Now show the admin page
		require_once plugin_dir_path( __FILE__ ) . 'partials/disqus-admin-partial.php';
	}
}

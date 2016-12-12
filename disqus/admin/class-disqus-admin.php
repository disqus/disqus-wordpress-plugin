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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $disqus       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $disqus, $version ) {

		$this->disqus = $disqus;
		$this->version = $version;

		add_action('admin_menu', array( $this, 'dsq_contruct_admin_menu' ));
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
	 * Builds the admin menu with the various Disqus options
	 *
	 * @since    1.0.0
	 */
	function dsq_contruct_admin_menu() {

		// Adds a section to the dashboard menu for Disqus
        //add_menu_page( 'Disqus', 'Disqus', 'moderate_comments', 'disqus', array( $this, 'dsq_render_admin_index' ), '', 24 );
        add_comments_page( 'Disqus', 'Disqus', 'moderate_comments', 'disqus', array( $this, 'dsq_render_admin_index' ) );
	}

	/**
	 * Renders the admin page view from a partial file
	 *
	 * @since    1.0.0
	 */
	function dsq_render_admin_index() {

		if ( isset( $_GET['error_description'] ) ) {
			add_action( 'admin_notices', 'disqus_oauth_error', 1, $_GET['error_description'] );
		}

		if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {

		    // Posting to this page implies a change in configuration. This page supports posting
		    // of the manual configuration through the form, or via the Disqus API Callback.
		    if ( isset( $_POST['dsq_shortname'] ) ) {
		    	$normalized_shortname = preg_replace( '/\s\s+/', '', strtolower( $_POST['dsq_shortname'] ) );
		        update_option( 'dsq_shortname', $normalized_shortname );

		        add_action( 'admin_notices', 'updated_shortname_notice', 1, $normalized_shortname );
		    }

		}

		require_once plugin_dir_path( __FILE__ ) . 'partials/disqus-admin-partial.php';
	}

	/**
	 * Displays an admin notice indicating the shortname config has changed
	 *
	 * @since    1.0.0
	 */
	function updated_shortname_notice($shortname) {
		echo '<div class="updated">
        	You\'ve just installed <strong>' . esc_html( $shortname ) . '</strong> onto your site!.
    	</div>';
	}

	/**
	 * Displays an admin notice indicating there was an error logging in
	 *
	 * @since    1.0.0
	 */
	function disqus_oauth_error($error_description) {
		echo '<div class="error">
		    There was an error logging in: ' . esc_html( $error_description ) .
		'</div>';
	}
}

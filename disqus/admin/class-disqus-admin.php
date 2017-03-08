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

	const REST_NAMESPACE = 'disqus/v1';

	const DISQUS_API_BASE = 'https://disqus.com/api/3.0/';

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

	/**
	 * When added as a filter, allows anonymous comments from the REST API.
	 * This is required for syncing.
	 *
	 * @since    1.0.0
	 */
	public function filter_rest_allow_anonymous_comments() {
		return true;
	}

	/**
	 * Registers Disqus plugin WordPress REST API endpoints.
	 *
	 * @since    1.0.0
	 */
	public function dsq_rest_add_endpoints() {
		register_rest_route( Disqus_Admin::REST_NAMESPACE, 'comments/sync', array(
			'methods' => 'POST',
			'callback' => array( $this, 'dsq_rest_sync_comment' ),
			'args' => array(
				'post_id' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
					'required' => true
				)
			)
		) );
	}

	/**
	 * Endpoint callback for comments/sync. Takes a Disqus comment and saves
	 * it to the local comments database.
	 *
	 * @since    1.0.0
	 * @param    array    $data       The request POST data.
	 * @return   WP_REST_Response     The API response object.
	 */
	public function dsq_rest_sync_comment( $data ) {
		$dsq_post_id = $data['post_id'];
		$secret_key = get_option( 'disqus_secret_key' );
		$access_token = get_option( 'disqus_admin_access_token' );

		if ( !$secret_key ) {
			return $this->dsq_rest_get_error( 'Secret key is not set.' );
		}

		// TODO: Check a custom header with the Disqus API secret key, sent in the request, and compare
		// to what's stored in the WP database.

		$api_url = Disqus_Admin::DISQUS_API_BASE . 'posts/details.json?'
			. 'api_secret=' . $secret_key
			. '&access_token=' . $access_token
			. '&post=' . (string)$dsq_post_id
			. '&related=thread';

		$dsq_response = wp_remote_get( $api_url, array(
			'headers' => array(
				'Referer' => '' // Unset referer so we can use secret key.
			)
		) );

		if ( !is_array( $dsq_response ) ) {
			return $this->dsq_rest_get_error( 'Unknown error requesting the Disqus API.' );
		}

		$dsq_response_data = json_decode( $dsq_response['body'] );

		if ( 0 !== $dsq_response_data->code ) {
			return $this->dsq_rest_get_error( $dsq_response_data->response, array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss
			) );
		}

		$post = $dsq_response_data->response;

		if ( $this->shortname !== $post->forum ) {
			return $this->dsq_rest_get_error( 'The comment\'s forum does not match the installed forum.' );
		}

		// Check to make sure we haven't synced this comment yet.
		$comment_query = new WP_Comment_Query( array(
			'meta_key' => 'dsq_post_id',
			'meta_value' => $post->id,
			'number' => 1
		) );

		if ( !empty( $comment_query->comments ) ) {
			return $this->dsq_rest_get_error( 'This comment has already been synced.' );
		}

		$wp_post_id = NULL;

		// Look up posts with the Disqus thread ID meta field
		$post_query = new WP_Query( array(
			'meta_key' => 'dsq_thread_id',
			'meta_value' => $post->thread->id
		) );

		if ( $post_query->have_posts() ) {
			$wp_post_id = $post_query->the_post()->ID;
			wp_reset_postdata();
		}

		// If that doesn't exist, get the  and update the matching post metadata
		if ( NULL === $wp_post_id || FALSE == $wp_post_id ) {
			$identifiers = $post->thread->identifiers;
			$first_identifier = count( $identifiers ) > 0 ? $identifiers[0] : NULL;

			if ( NULL !== $first_identifier ) {
				$wp_post_id = explode( ' ', $first_identifier, 2 )[0];
			}

			// Keep the post's thread ID meta up to date
			update_post_meta( $wp_post_id, 'dsq_thread_id', $post->thread->id );
		}

		if ( NULL === $wp_post_id || FALSE == $wp_post_id ) {
			return $this->dsq_rest_get_error( 'No post found associated with the thread.', array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss
			) );
		}

		$parent = 0;
		if ( NULL !== $post->parent ) {
			$parent_comment_query = new WP_Comment_Query( array(
				'meta_key' => 'dsq_post_id',
				'meta_value' => (string)$post->parent,
				'number' => 1
			) );

			if ( empty( $comment_query->comments ) ) {
				return $this->dsq_rest_get_error( 'This comment\'s parent has not been synced yet.', array(
					// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss
				) );
			} else {
				$parent = $comment_query->comments[0]->$comment_ID;
			}
		}

		// Email is a special permission for Disqus API applications and won't be present
		// if the user has not set the permission for their API application.
		$author_email = NULL;
		if ( isset( $post->author->email ) ) {
			$author_email = $post->author->email;
		} else if ( $post->author->isAnonymous ) {
			$author_email = 'anonymized-' . md5( $post->author->name ) . '@disqus.com';
		} else {
			$author_email = 'user-' . $post->author->id . '@disqus.com';
		}

		$wp_request = new WP_REST_Request( 'POST', '/wp/v2/comments' );
		$wp_request->set_param( 'author_email', $author_email );
		$wp_request->set_param( 'author_name', $post->author->name );
		$wp_request->set_param( 'author_url', $post->author->url );
		$wp_request->set_param( 'date_gmt', $post->createdAt );
		$wp_request->set_param( 'content', $post->raw_message );
		$wp_request->set_param( 'post', (int)$wp_post_id );
		$wp_request->set_param( 'parent', $parent );

		$wp_response = rest_do_request( $wp_request );

		if ( $wp_response->is_error() ) {
			$wp_error = $wp_response->as_error();
			return $this->dsq_rest_get_error( $wp_error->get_error_message(), array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss
			) );
		}

		$wp_response_data = $wp_response->get_data();

		// Add Disqus post ID as meta to local comment to avoid duplicates
		add_comment_meta( $wp_response_data['id'], 'dsq_post_id', $post->id );

		return $this->dsq_rest_get_response( $wp_response_data );
	}

	/**
	 * Utility function to format REST API responses.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @param    array    $data       The request data to be returned.
	 * @return   WP_REST_Response     The API response object.
	 */
	private function dsq_rest_get_response( $data ) {
		return new WP_REST_Response( array(
			'code' => 'OK',
			'message' => 'Request completed successfully',
			'data' => $data
		), 200 );
	}

	/**
	 * Utility function to format REST API errors, and to optionally log them.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @param    string   $message    The error message to be returned.
	 * @param    array    $log        The log parameters to save.
	 * @return   WP_Error     		  The API error object.
	 */
	private function dsq_rest_get_error( $message, $log = NULL ) {
		if ( NULL !== $log ) {
			// TODO: Store the log array data somewhere
		}
		return new WP_Error( 'api_error', $message );
	}

	/**
	 * Utility function to create a Disqus admin URL given a path.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @param    string    $path      The URL path to point to in the admin.
	 * @return   string     		  The full Disqus admin path for the given forum.
	 */
	private function get_admin_url_for_forum( $path ) {
		return 'https://' . $this->shortname . '.disqus.com/admin/' . $path . '/';
	}
}

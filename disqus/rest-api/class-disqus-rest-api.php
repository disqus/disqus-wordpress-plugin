<?php
/**
 * The REST API-specific functionality of the plugin.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/rest-api
 */

/**
 * Defines the REST API endpoints for the plugin
 *
 * @package    Disqus
 * @subpackage Disqus/rest-api
 * @author     Ryan Valentin <ryan@disqus.com>
 */
class Disqus_Rest_Api {

	const REST_NAMESPACE = 'disqus/v1';

	const DISQUS_API_BASE = 'https://disqus.com/api/3.0/';

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
	 * @param    string $shortname    The configured Disqus shortname.
	 */
	public function __construct( $shortname ) {
		$this->shortname = $shortname;
	}

    /**
	 * When added as a filter, allows anonymous comments from the REST API.
	 * This is required for syncing.
	 *
	 * @since     1.0.0
	 * @return    boolean    Whether to allow anonymous comments.
	 */
	public function filter_rest_allow_anonymous_comments() {
		return true;
	}

	/**
	 * Callback to ensure user has manage_options permissions.
	 *
	 * @since     1.0.0
	 * @return    boolean    Whether the user has permission to the admin REST API.
	 */
	public function rest_admin_only_permission_callback() {
		// TODO: Check for Disqus server permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->rest_get_error( 'You must be logged in and have admin permissions for this resource.' );
		}
		return true;
	}

	/**
	 * Registers Disqus plugin WordPress REST API endpoints.
	 *
	 * @since    1.0.0
	 */
	public function register_endpoints() {
		register_rest_route( Disqus_Rest_Api::REST_NAMESPACE, 'comments/sync', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_comments_sync' ),
			'args' => array(
				'post_id' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
					'required' => true,
				),
			),
		) );

		register_rest_route( Disqus_Rest_Api::REST_NAMESPACE, 'settings', array(
			array(
				'methods' => array( 'GET', 'PUT' ),
				'callback' => array( $this, 'rest_settings' ),
				'permission_callback' => array( $this, 'rest_admin_only_permission_callback' ),
			),
			'schema' => array( $this, 'dsq_get_settings_schema' ),
		) );
	}

    /**
	 * Utility function to format REST API responses.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @param    array $data         The request data to be returned.
	 * @return   WP_REST_Response    The API response object.
	 */
	private function rest_get_response( array $data ) {
		return new WP_REST_Response( array(
			'code' => 'OK',
			'message' => 'Request completed successfully',
			'data' => $data,
		), 200 );
	}

	/**
	 * Utility function to format REST API errors, and to optionally log them.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @param    string $message    The error message to be returned.
	 * @param    array  $log        The log parameters to save.
	 * @return   WP_Error     		The API error object.
	 */
	private function rest_get_error( $message, array $log = null ) {
		if ( null !== $log ) {
			// TODO: Store the log array data somewhere?
		}
		return new WP_Error( 'api_error', $message );
	}

    /**
	 * Endpoint callback for comments/sync. Takes a Disqus comment and saves
	 * it to the local comments database.
	 *
	 * @since    1.0.0
	 * @param    array $data         The request POST data.
	 * @return   WP_REST_Response    The API response object.
	 */
	public function rest_comments_sync( array $data ) {
		$dsq_post_id = $data['post_id'];
		$secret_key = get_option( 'disqus_secret_key' );
		$access_token = get_option( 'disqus_admin_access_token' );

		if ( ! $secret_key ) {
			return $this->rest_get_error( 'Secret key is not set.' );
		}

		$api_url = Disqus_Rest_Api::DISQUS_API_BASE . 'posts/details.json?'
			. 'api_secret=' . $secret_key
			. '&access_token=' . $access_token
			. '&post=' . (string) $dsq_post_id
			. '&related=thread';

		$dsq_response = wp_remote_get( $api_url, array(
			'headers' => array(
				'Referer' => '', // Unset referer so we can use secret key.
			),
		) );

		if ( ! is_array( $dsq_response ) ) {
			return $this->rest_get_error( 'Unknown error requesting the Disqus API.' );
		}

		$dsq_response_data = json_decode( $dsq_response['body'] );

		if ( 0 !== $dsq_response_data->code ) {
			return $this->rest_get_error( $dsq_response_data->response, array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss.
			) );
		}

		$post = $dsq_response_data->response;

		if ( $this->shortname !== $post->forum ) {
			return $this->rest_get_error( 'The comment\'s forum does not match the installed forum.' );
		}

		// Check to make sure we haven't synced this comment yet.
		$comment_query = new WP_Comment_Query( array(
			'meta_key' => 'dsq_post_id',
			'meta_value' => $post->id,
			'number' => 1,
		) );

		if ( ! empty( $comment_query->comments ) ) {
			return $this->rest_get_error( 'This comment has already been synced.' );
		}

		$wp_post_id = null;

		// Look up posts with the Disqus thread ID meta field.
		$post_query = new WP_Query( array(
			'meta_key' => 'dsq_thread_id',
			'meta_value' => $post->thread->id,
		) );

		if ( $post_query->have_posts() ) {
			$wp_post_id = $post_query->the_post()->ID;
			wp_reset_postdata();
		}

		// If that doesn't exist, get the  and update the matching post metadata.
		if ( null === $wp_post_id || false === $wp_post_id ) {
			$identifiers = $post->thread->identifiers;
			$first_identifier = count( $identifiers ) > 0 ? $identifiers[0] : null;

			if ( null !== $first_identifier ) {
				$wp_post_id = explode( ' ', $first_identifier, 2 )[0];
			}

			// Keep the post's thread ID meta up to date.
			update_post_meta( $wp_post_id, 'dsq_thread_id', $post->thread->id );
		}

		if ( null === $wp_post_id || false == $wp_post_id ) {
			return $this->rest_get_error( 'No post found associated with the thread.', array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss.
			) );
		}

		$parent = 0;
		if ( null !== $post->parent ) {
			$parent_comment_query = new WP_Comment_Query( array(
				'meta_key' => 'dsq_post_id',
				'meta_value' => (string) $post->parent,
				'number' => 1,
			) );

			if ( empty( $comment_query->comments ) ) {
				return $this->rest_get_error( 'This comment\'s parent has not been synced yet.', array(
					// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss.
				) );
			} else {
				$parent = $comment_query->comments[0]->$comment_ID;
			}
		}

		// Email is a special permission for Disqus API applications and won't be present
		// if the user has not set the permission for their API application.
		$author_email = null;
		if ( isset( $post->author->email ) ) {
			$author_email = $post->author->email;
		} elseif ( $post->author->isAnonymous ) {
			$author_email = 'anonymized-' . md5( $post->author->name ) . '@disqus.com';
		} else {
			$author_email = 'user-' . $post->author->id . '@disqus.com';
		}

		$wp_request = new WP_REST_Request( 'POST', '/wp/v2/comments' );
		$wp_request->set_param( 'author_email', $author_email );
		$wp_request->set_param( 'author_name', $post->author->name );
		$wp_request->set_param( 'author_url', $post->author->url );
		// you can also set ( 'date_gmt', $post->createdAt ).
		$wp_request->set_param( 'content', $post->raw_message );
		$wp_request->set_param( 'post', (int) $wp_post_id );
		$wp_request->set_param( 'parent', $parent );

		$wp_response = rest_do_request( $wp_request );

		if ( $wp_response->is_error() ) {
			$wp_error = $wp_response->as_error();
			return $this->rest_get_error( $wp_error->get_error_message(), array(
				// TODO: Log these errors somewhere and provide a method in the admin to retry/dismiss.
			) );
		}

		$wp_response_data = $wp_response->get_data();

		// Add Disqus post ID as meta to local comment to avoid duplicates.
		add_comment_meta( $wp_response_data['id'], 'dsq_post_id', $post->id );

		return $this->rest_get_response( $wp_response_data );
	}

	/**
	 * Endpoint callback for comments/sync. Takes a Disqus comment and saves
	 * it to the local comments database.
	 *
	 * @since    1.0.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   WP_REST_Response     		 The API response object.
	 */
	public function rest_settings( WP_REST_Request $request ) {
		$settings = array();

		$should_update = 'PUT' === $request->get_method();
		$json = $request->get_json_params();
		$schema = $this->dsq_get_settings_schema();

		foreach ( $schema['properties'] as $key => $schema_value ) {
			$should_update_param = $should_update && isset( $json[ $key ] ) && $schema_value['readonly'] === false;
			if ( $should_update_param ) {
				update_option( $key, $json[ $key ] );
			}
			$settings[ $key ] = get_option( $key, null );

			// Escape only values that have been set, otherwise esc_attr() will change null to an empty string.
			if ( null !== $settings[ $key ] )
				$settings[ $key ] = esc_attr( $settings[ $key ] );
		}

		// Add additional non-database options here.
		$settings['disqus_installed'] = trim( $settings['disqus_forum_url'] ) !== '';
		$settings['disqus_sync_activated'] = false; // TODO: Figure out criteria to say true/false.

		return $this->rest_get_response( $settings );
	}

	/**
	 * Returns the schema for the Disqus admin settings REST endpoint.
	 *
	 * @since     1.0.0
	 * @access    private
	 * @return    array    The REST schema.
	 */
	private function dsq_get_settings_schema() {
		return array(
			// This tells the spec of JSON Schema we are using which is draft 4.
			'$schema' => 'http://json-schema.org/draft-04/schema#',
			// The title property marks the identity of the resource.
			'title' => 'settings',
			'type' => 'object',
			// In JSON Schema you can specify object properties in the properties attribute.
			'properties' => array(
				'disqus_forum_url' => array(
					'description' => 'Your site\'s unique identifier',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_sso_enabled' => array(
					'description' => 'This will enable Single Sign-on for this site, if already enabled for your Disqus organization.',
					'type' => 'boolean',
					'readonly' => false,
				),
				'disqus_public_key' => array(
					'description' => 'The public key of your application.',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_secret_key' => array(
					'description' => 'The secret key of your application.',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_admin_access_token' => array(
					'description' => 'The primary admin\'s access token for your application.',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_sso_button' => array(
					'description' => 'A link to a .png, .gif, or .jpg image to show as a button in Disqus.',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_manual_sync' => array(
					'description' => 'This will back up comments to your WordPress database when made in Disqus.',
					'type' => 'string',
					'readonly' => false,
				),
				'disqus_sync_token' => array(
					'description' => 'The shared secret token for data sync between Disqus and the plugin.',
					'type' => 'string',
					'readonly' => true,
				),
				'disqus_sync_activated' => array(
					'description' => 'Whether the webhook link has been established with Disqus.',
					'type' => 'boolean',
					'readonly' => true,
				),
				'disqus_installed' => array(
					'description' => 'The shared secret token for data sync between Disqus and the plugin.',
					'type' => 'boolean',
					'readonly' => true,
				),
			),
		);
	}
}
?>

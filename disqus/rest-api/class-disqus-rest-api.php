<?php
/**
 * The REST API-specific functionality of the plugin.
 *
 * @link       https://disqus.com
 * @since      3.0
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
	 * Instance of the Disqus API service.
	 *
	 * @since    3.0
	 * @access   private
	 * @var      Disqus_Api_Service    $api_service    Instance of the Disqus API service.
	 */
	private $api_service;

    /**
	 * The unique Disqus forum shortname.
	 *
	 * @since    3.0
	 * @access   private
	 * @var      string    $shortname    The unique Disqus forum shortname.
	 */
	private $shortname;

    /**
	 * Initialize the class and set its properties.
	 *
	 * @since    3.0
	 * @param    Disqus_Api_Service $api_service    Instance of the Disqus API service.
	 * @param    string             $shortname    	The configured Disqus shortname.
	 */
	public function __construct( $api_service, $shortname ) {
		$this->api_service = $api_service;
		$this->shortname = $shortname;
	}

    /**
	 * When added as a filter, allows anonymous comments from the REST API.
	 * This is required for syncing.
	 *
	 * @since     3.0
	 * @return    boolean    Whether to allow anonymous comments.
	 */
	public function filter_rest_allow_anonymous_comments() {
		return true;
	}

	/**
	 * Callback to ensure user has manage_options permissions.
	 *
	 * @since     3.0
	 * @return    boolean    Whether the user has permission to the admin REST API.
	 */
	public function rest_admin_only_permission_callback() {
		// TODO: Check for Disqus server permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			return $this->rest_get_error( 'You must be logged in and have admin permissions for this resource.', 401 );
		}
		return true;
	}

	/**
	 * Registers Disqus plugin WordPress REST API endpoints.
	 *
	 * @since    3.0
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

		register_rest_route( Disqus_Rest_Api::REST_NAMESPACE, 'sync/status', array(
			array(
				'methods' => 'GET',
				'callback' => array( $this, 'rest_sync_status' ),
				'permission_callback' => array( $this, 'rest_admin_only_permission_callback' ),
			),
		) );

		register_rest_route( Disqus_Rest_Api::REST_NAMESPACE, 'sync/enable', array(
			array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_sync_enable' ),
				'permission_callback' => array( $this, 'rest_admin_only_permission_callback' ),
			),
		) );

		register_rest_route( Disqus_Rest_Api::REST_NAMESPACE, 'sync/disable', array(
			array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_sync_disable' ),
				'permission_callback' => array( $this, 'rest_admin_only_permission_callback' ),
			),
		) );
	}

    /**
	 * Utility function to format REST API responses.
	 *
	 * @since    3.0
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
	 * @since    3.0
	 * @access   private
	 * @param    string $message        The error message to be returned.
	 * @param    int    $status_code    The http status code of the error.
	 * @return   WP_Error     		    The API error object.
	 */
	private function rest_get_error( $message, $status_code = 500 ) {
		return new WP_Error(
			'api_error',
			$message,
			array(
				'status' => $status_code,
			)
		);
	}

    /**
	 * Endpoint callback for comments/sync. Takes a Disqus comment and saves
	 * it to the local comments database.
	 *
	 * @since    3.0
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
	 * @since    3.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   WP_REST_Response     		 The API response object.
	 */
	public function rest_settings( WP_REST_Request $request ) {
		$should_update = 'PUT' === $request->get_method();
		$new_settings = $should_update ? $this->get_request_data( $request ) : null;
		$updated_settings = $this->get_or_update_settings( $new_settings );

		return $this->rest_get_response( $updated_settings );
	}

	/**
	 * Endpoint callback for fetching automatic syncing status.
	 *
	 * @since    3.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   WP_REST_Response     		 The API response object.
	 */
	public function rest_sync_status( WP_REST_Request $request ) {
		try {
			$status = $this->get_sync_status();

			return $this->rest_get_response( $status );
		} catch ( Exception $e ) {
			return $this->rest_get_error( $e->getMessage() );
		}
	}

	/**
	 * Endpoint callback for enabling automatic syncing.
	 *
	 * @since    3.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   WP_REST_Response     		 The API response object.
	 */
	public function rest_sync_enable( WP_REST_Request $request ) {
		try {
			$status = $this->enable_sync();

			return $this->rest_get_response( $status );
		} catch ( Exception $e ) {
			return $this->rest_get_error( $e->getMessage() );
		}
	}

	/**
	 * Endpoint callback for disabling automatic syncing.
	 *
	 * @since    3.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   WP_REST_Response     		 The API response object.
	 */
	public function rest_sync_disable( WP_REST_Request $request ) {
		try {
			$status = $this->disable_sync();

			return $this->rest_get_response( $status );
		} catch ( Exception $e ) {
			return $this->rest_get_error( $e->getMessage() );
		}
	}

	/**
	 * Parses and returns body content for either form-url-encoded or json data.
	 *
	 * @since    3.0
	 * @param    WP_REST_Request $request    The request object.
	 * @return   array     		 Array of parsed request data.
	 */
	private function get_request_data( WP_REST_Request $request ) {
		$content_type = $request->get_content_type();

		switch ( $content_type['value'] ) {
			case 'application/json':
				return $request->get_json_params();
			default:
				return $request->get_body_params();
		}
	}

	/**
	 * Fetches all available plugin options and updates any values if passed, and returns updated array.
	 *
	 * @since     3.0
	 * @param     array $new_settings    Any options to be updated.
	 * @access    private
	 * @return    array    The current settings array.
	 */
	private function get_or_update_settings( $new_settings = null ) {
		$settings = array();
		$schema = $this->dsq_get_settings_schema();
		$should_update = is_array( $new_settings );

		// Loops through properties in our schema to check the value and update if needed.
		foreach ( $schema['properties'] as $key => $schema_value ) {
			$should_update_param = $should_update && isset( $new_settings[ $key ] ) && false === $schema_value['readonly'];
			if ( $should_update_param ) {
				update_option( $key, $new_settings[ $key ] );
			}
			$settings[ $key ] = get_option( $key, null );

			// Escape only values that have been set, otherwise esc_attr() will change null to an empty string.
			if ( null !== $settings[ $key ] ) {
				$settings[ $key ] = esc_attr( $settings[ $key ] );
			}
		}

		// Add additional non-database options here.
		$settings['disqus_installed'] = trim( $settings['disqus_forum_url'] ) !== '';

		return $settings;
	}

	/**
	 * Determines if subscription information matches information about this WordPress site.
	 *
	 * @since    3.0
	 * @param    array $subscription    The Disqus webhook subscription array.
	 * @return   boolean    			Whether the subscription information belongs to this WordPress site.
	 */
	private function validate_subscription( $subscription ) {
		return get_option( 'disqus_sync_token' ) === $subscription['secret']  &&
			rest_url( Disqus_Rest_Api::REST_NAMESPACE . '/comments/sync' ) === $subscription['url'];
	}

	/**
	 * Fetches and returns the syncing status from the Disqus servers.
	 *
	 * @since    3.0
	 * @return   array        The syncing status array.
	 * @throws   Exception    An exception if the Disqus API doesn't return with code 0 (status: 200).
	 */
	private function get_sync_status() {
		$is_subscribed = false;
		$is_enabled = false;
		$current_subscription = null;

		if ( get_option( 'disqus_secret_key' ) && get_option( 'disqus_admin_access_token' ) ) {
			$api_data = $this->api_service->api_get( 'forums/webhooks/list', array(
				'forum' => $this->shortname,
			));

			if ( is_object( $api_data ) && is_array( $api_data->response ) ) {
				// Loop through each subscription, looking for the first match.
				foreach ( $api_data->response as $subscription ) {
					if ( $this->validate_subscription( $subscription ) ) {
						$current_subscription = $subscription;
						$is_subscribed = true;
						break;
					}
				}
			} elseif ( 0 !== $api_data->code ) {
				throw new Exception( $api_data->response );
			}
		}

		return array(
			'subscribed' => $is_subscribed,
			'enabled' => $is_enabled,
			'subscription' => $current_subscription,
		);
	}

	/**
	 * Enables automatic syncing from Disqus if disabled.
	 *
	 * @since    3.0
	 * @return   array    The syncing status array.
	 * @throws   Exception    An exception if the Disqus API doesn't return with code 0 (status: 200).
	 */
	private function enable_sync() {
		$sync_status = $this->get_sync_status();
		$endpoint = null;
		$params = null;

		if ( ! $sync_status['subscribed'] ) {
			$endpoint = 'forums/webhooks/create';
			$params = array(
				'forum' => $this->shortname,
				'url' => rest_url( Disqus_Rest_Api::REST_NAMESPACE . '/comments/sync' ),
				'secret' => get_option( 'disqus_sync_token' ),
				'enableSending' => '1',
			);
		} elseif ( ! $sync_status['enabled'] ) {
			$endpoint = 'forums/webhooks/update';
			$params = array(
				'subscription' => $sync_status['subscription']['id'],
				'enableSending' => '1',
			);
		}

		if ( null !== $endpoint ) {
			$api_data = $this->api_service->api_post( $endpoint, $params );

			if ( 0 !== $api_data->code ) {
				$sync_status = array(
					'subscribed' => true,
					'enabled' => true,
					'subscription' => $api_data->response,
				);
			} else {
				throw new Exception( $api_data->response );
			}
		}

		return $sync_status;
	}

	/**
	 * Disables automatic syncing from Disqus if enabled.
	 *
	 * @since    3.0
	 * @return   array    The syncing status array.
	 * @throws   Exception    An exception if the Disqus API doesn't return with code 0 (status: 200).
	 */
	private function disable_sync() {
		$sync_status = $this->get_sync_status();

		if ( true === $sync_status['enabled'] ) {
			$params = array(
				'subscription' => $sync_status['subscription']['id'],
				'enableSending' => '0',
			);
			$api_data = $this->api_service->api_post( 'forums/webhooks/update', $params );

			if ( 0 !== $api_data->code ) {
				$sync_status = array(
					'subscribed' => true,
					'enabled' => false,
					'subscription' => $api_data->response,
				);
			} else {
				throw new Exception( $api_data->response );
			}
		}

		return $sync_status;
	}

	/**
	 * Returns the schema for the Disqus admin settings REST endpoint.
	 *
	 * @since     3.0
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
				'disqus_sync_token' => array(
					'description' => 'The shared secret token for data sync between Disqus and the plugin.',
					'type' => 'string',
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

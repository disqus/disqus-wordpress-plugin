<?php
/**
 * The service for making requests to the Disqus API
 *
 * @link       https://disqus.com
 * @since      3.0
 *
 * @package    Disqus
 * @subpackage Disqus/includes
 */

/**
 * The service for making requests to the Disqus API
 *
 * @package    Disqus
 * @subpackage Disqus/includes
 * @author     Ryan Valentin <ryan@disqus.com>
 */
class Disqus_Api_Service {

	const DISQUS_API_BASE = 'https://disqus.com/api/3.0/';

    /**
	 * The Disqus API secret key.
	 *
	 * @since    3.0
	 * @access   private
	 * @var      string    $api_secret    The Disqus API secret key.
	 */
	private $api_secret;

	/**
	 * The Disqus access token for authentication.
	 *
	 * @since    3.0
	 * @access   private
	 * @var      string    $access_token    The Disqus access token for authentication.
	 */
	private $access_token;

    /**
	 * Initialize the class and set its properties.
	 *
	 * @since    3.0
	 * @param    string $api_secret       The Disqus API secret key.
	 * @param    string $access_token     The admin access token associated with the $api_secret.
	 */
	public function __construct( $api_secret, $access_token = '' ) {
		$this->api_secret = $api_secret;
		$this->access_token = $access_token;
	}

	/**
	 * Makes a GET request to the Disqus API.
	 *
	 * @since     3.0
	 * @param     string $endpoint    The Disqus API secret key.
	 * @param     array  $params      The params to be appended to the query.
	 * @return    array               The response data array.
	 */
	public function api_get( $endpoint, $params ) {
		$api_url = Disqus_Api_Service::DISQUS_API_BASE . $endpoint . '.json?'
			. 'api_secret=' . $this->api_secret
			. '&access_token=' . $this->access_token;

		foreach ( $params as $key => $values_array ) {
			if ( ! is_array( $values_array ) ) {
				$values_array = array( $values_array );
			}

			foreach ( $values_array as $value ) {
				$api_url .= '&' . $key . '=' . urlencode( $value );
			}
		}

		$dsq_response = wp_remote_get( $api_url, array(
			'headers' => array(
				'Referer' => '', // Unset referer so we can use secret key.
			),
		) );

		$dsq_response_data = json_decode( $dsq_response['body'] );

		return $dsq_response_data;
	}

	/**
	 * Makes a POST request to the Disqus API.
	 *
	 * @since     3.0
	 * @param     string $endpoint    The Disqus API secret key.
	 * @param     array  $params      The params to be added to the body.
	 * @return    array               The response data array.
	 */
	public function api_post( $endpoint, $params ) {
		$api_url = Disqus_Api_Service::DISQUS_API_BASE . $endpoint . '.json?'
			. 'api_secret=' . $this->api_secret
			. '&access_token=' . $this->access_token;

		$dsq_response = wp_remote_post( $api_url, array(
			'body' => $params,
			'headers' => array(
				'Referer' => '', // Unset referer so we can use secret key.
			),
			'method' => 'POST',
		) );

		$dsq_response_data = json_decode( $dsq_response['body'] );

		return $dsq_response_data;
	}
}

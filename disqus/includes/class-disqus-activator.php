<?php
/**
 * Fired during plugin activation
 *
 * @link       https://disqus.com
 * @since      3.0
 *
 * @package    Disqus
 * @subpackage Disqus/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      3.0
 * @package    Disqus
 * @subpackage Disqus/includes
 * @author     Ryan Valentin <ryan@disqus.com>
 */
class Disqus_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    3.0
	 */
	public static function activate() {
		$existing_token = get_option( 'disqus_sync_token', null );

		// Create a shared secret token that will be used for install/syncing with Disqus.
		if ( empty( $existing_token ) ) {
			update_option( 'disqus_sync_token', bin2hex( random_bytes( 16 ) ) );
		}
	}

}

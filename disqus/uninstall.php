<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @link       https://disqus.com
 * @since      3.0.0
 *
 * @package    Disqus
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! current_user_can( 'install_plugins' ) ) {
	exit;
}

const ALL_SETTINGS = array(
	'disqus_forum_url',
	'disqus_sso_enabled',
	'disqus_public_key',
	'disqus_secret_key',
	'disqus_admin_access_token',
	'disqus_sso_button',
	'disqus_manual_sync',
	'disqus_sync_token',
);

foreach ( ALL_SETTINGS as $key ) {
	delete_option( $key );
}

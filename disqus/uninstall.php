<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( !current_user_can( 'install_plugins' ) ) {
	exit;
}

delete_option( 'disqus_forum_url' );
delete_option( 'disqus_public_key' );
delete_option( 'disqus_secret_key' );
delete_option( 'disqus_sso_enabled' );
delete_option( 'disqus_sso_button' );

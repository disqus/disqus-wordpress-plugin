<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://disqus.com
 * @since             1.0.0
 * @package           Disqus
 *
 * @wordpress-plugin
 * Plugin Name:       Disqus Minimal
 * Plugin URI:        https://disqus.com/admin/wordpress/
 * Description:       Minimal Disqus installation for Wordpress. Assists with installing and showing comments on your site,
 * but doesn't include exporting and syncing features. These functions are still available to run manually.
 * Version:           1.0.0
 * Author:            Ryan Valentin
 * Author URI:        http://ryanvalentin.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       disqus
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Echoes a localized string using a format.
 *
 * @since    1.0.0
 * @param    string    $text    The string to be localized
 * @return   string    The localized string.
 */
function dsq_gettext( $text ) {
	return esc_html__( $text );
}

/**
 * Echoes a localized string using a format.
 *
 * @since    1.0.0
 * @param    string    $format    The string format of the localized text
 * @param    mixed     $args      Arguments to pass to the formatted string
 */
function dsq_gettext_e( $format, ...$args ) {
	if ( 0 == count($args ) ) {
		echo dsq_gettext( $format );
		return;
	}

	printf( dsq_gettext( $format ), ...$args );
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-disqus-activator.php
 */
function activate_disqus() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-disqus-activator.php';
	Disqus_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-disqus-deactivator.php
 */
function deactivate_disqus() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-disqus-deactivator.php';
	Disqus_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_disqus' );
register_deactivation_hook( __FILE__, 'deactivate_disqus' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-disqus.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_disqus() {

	$plugin = new Disqus();
	$plugin->run();

}
run_disqus();

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
 * @since             3.0
 * @package           Disqus
 *
 * @wordpress-plugin
 * Plugin Name:       Disqus
 * Plugin URI:        https://disqus.com/admin/wordpress/
 * Description:       Disqus installation for Wordpress. Assists with installing and showing comments on your site,
 * but doesn't include exporting and syncing features. These functions are still available to run manually.
 * Version:           3.0
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
 * @since    3.0
 */
function run_disqus() {

	$plugin = new Disqus();
	$plugin->run();

}
run_disqus();

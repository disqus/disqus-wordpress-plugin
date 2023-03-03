<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Disqus
 */

// PHPUnit Polyfills is a requirement as of WordPress 5.9, see:
// https://make.wordpress.org/core/handbook/references/phpunit-compatibility-and-wordpress-versions/
require dirname( dirname( __FILE__ ) ) . '/vendor/yoast/phpunit-polyfills/phpunitpolyfills-autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}

define( 'PLUGIN_FILE', getenv( 'DISQUS_PLUGIN' ) );
define( 'PLUGIN_FOLDER', basename( dirname( __DIR__ ) ) );
define( 'PLUGIN_PATH', PLUGIN_FOLDER . '/' . PLUGIN_FILE );
define( 'DISQUS_REST_NAMESPACE', '/disqus/v1' );

// Activates this plugin in WordPress so it can be tested.
$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( PLUGIN_PATH ),
);

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( __DIR__ ) . '/' . PLUGIN_FILE;
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';

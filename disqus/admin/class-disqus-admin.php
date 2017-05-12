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

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $disqus    The ID of this plugin.
     */
    private $disqus;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version    The current version of this plugin.
     */
    private $version;

    /**
     * The unique Disqus forum shortname.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $shortname    The unique Disqus forum shortname.
     */
    private $shortname;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param    string $disqus       The name of this plugin.
     * @param    string $version      The version of this plugin.
     * @param    string $shortname    The configured Disqus shortname.
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

        wp_enqueue_style(
            $this->disqus, plugin_dir_url( __FILE__ ) . 'css/disqus-admin.css',
            array(),
            $this->version,
            'all'
        );

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

         $admin_js_vars = array(
            'rest' => array(
                'base' => esc_url_raw( rest_url( 'disqus/v1/' ) ),

                // Nonce is required so that the REST api permissions can recognize a user/check permissions.
                'nonce' => wp_create_nonce( 'wp_rest' ),
            ),
            'adminUrls' => array(
                'disqus' => get_admin_url( null, 'admin.php?page=disqus' ),
                'editComments' => get_admin_url( null, 'edit-comments.php' ),
            ),
            'permissions' => array(
                'canManageSettings' => current_user_can( 'manage_options' ),
            ),
            'site' => array(
                'name' => $this->get_site_name(),
            ),
        );

        // TODO: Match language of the WordPress installation against any other localizations once they've been set up.
        $language_code = 'en';

        $file = $language_code . '.' . ( WP_DEBUG ? 'disqus-admin.bundle.js' : 'disqus-admin.bundle.min.js' );
        wp_enqueue_script(
            $this->disqus . '_admin',
            plugin_dir_url( __FILE__ ) . 'js/' . $file,
            array(),
            $this->version,
            true
        );
        wp_localize_script( $this->disqus . '_admin', 'DISQUS_WP', $admin_js_vars );
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
        if ( current_user_can( 'moderate_comments' ) ) {
            remove_menu_page( 'edit-comments.php' );
            add_menu_page(
                'Disqus',
                'Disqus',
                'moderate_comments',
                'disqus',
                array( $this, 'dsq_render_admin_index' ),
                'dashicons-admin-comments',
                24
            );
        }
    }

    /**
     * Builds the admin menu with the various Disqus options
     *
     * @since    1.0.0
     * @param    WP_Admin_Bar $wp_admin_bar    Instance of the WP_Admin_Bar.
     */
    public function dsq_construct_admin_bar_menu( $wp_admin_bar ) {
        // Replace the existing WordPress comments menu item to prevent confusion
        // about where to administer comments. The Disqus page will have a link to
        // see WordPress comments.
        if ( current_user_can( 'moderate_comments' ) ) {
            $wp_admin_bar->remove_node( 'wp-admin-bar-comments' );

            $new_node_args = array(
                'id' => 'disqus',
                'title' => 'Disqus',
                'href' => 'https://disqus.com/',
                'meta' => array(
                    'class' => 'disqus-menu-bar',
                ),
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
        require_once plugin_dir_path( __FILE__ ) . 'partials/disqus-admin-partial.php';
    }

    /**
     * Utility function get the site's name for display in HTML markup.
     *
     * @since    1.0.0
     * @access   private
     * @return   string    The escaped name for the given site.
     */
    private function get_site_name() {
        return esc_html( get_bloginfo( 'name' ) );
    }
}

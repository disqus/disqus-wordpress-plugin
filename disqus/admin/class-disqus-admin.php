<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://disqus.com
 * @since      3.0
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
     * WordPress version required to replace the comments list table so unmatched
     * synced comments can show a Disqus thread link in "In response to".
     *
     * @since    3.1.5
     */
    const COMMENTS_LIST_TABLE_MIN_WP = '6.1';

    /**
     * The ID of this plugin.
     *
     * @since    3.0
     * @access   private
     * @var      string $disqus    The ID of this plugin.
     */
    private $disqus;

    /**
     * The version of this plugin.
     *
     * @since    3.0
     * @access   private
     * @var      string $version    The current version of this plugin.
     */
    private $version;

    /**
     * The unique Disqus forum shortname.
     *
     * @since    3.0
     * @access   private
     * @var      string $shortname    The unique Disqus forum shortname.
     */
    private $shortname;

    /**
     * Initialize the class and set its properties.
     *
     * @since    3.0
     * @param    string $disqus       The name of this plugin.
     * @param    string $version      The version of this plugin.
     * @param    string $shortname    The configured Disqus shortname.
     */
    public function __construct( $disqus, $version, $shortname ) {

        $this->disqus = $disqus;
        $this->version = $version;
        $this->shortname = $shortname;
        $this->ensure_sync_token();
    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    3.0
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
     * @since    3.0
     */
    public function enqueue_scripts() {
        if ( ! isset( $_GET['page'] ) || 'disqus' !== $_GET['page'] ) {
            return;
        }

        if ( ! function_exists( 'get_plugins' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        global $wp_version;

        $admin_js_vars = array(
            'rest' => array(
                'base' => esc_url_raw( rest_url( '/' ) ),
                'disqusBase' => 'disqus/v1/',

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
                'pluginVersion' => $this->version,
                'allPlugins' => get_plugins(),
                'phpVersion' => phpversion(),
                'wordpressVersion' => $wp_version,
            ),
        );

        // TODO: Match language of the WordPress installation against any other localizations once they've been set up.
        $language_code = 'en';

        $file = $language_code;
        $file .= '.disqus-admin.bundle.';
        $file .= $this->version;
        $file .= WP_DEBUG ? '.js' : '.min.js';

        wp_enqueue_script(
            $this->disqus . '_admin',
            plugin_dir_url( __FILE__ ) . 'bundles/js/' . $file,
            array(),
            $this->version,
            true
        );
        wp_localize_script( $this->disqus . '_admin', 'DISQUS_WP', $admin_js_vars );
    }

    /**
     * Filter for the get_rest_url function which ensures REST URLs match admin hosts.
     *
     * @since    3.0
     * @param    string $rest_url    The REST URL.
     * @return   string              The filtered REST URL.
     */
    public function dsq_filter_rest_url( $rest_url ) {
        $rest_url_parts = parse_url( $rest_url );
        if ( is_array( $rest_url_parts ) && array_key_exists( 'host', $rest_url_parts ) ) {
            $rest_host = $rest_url_parts['host'];
            if ( array_key_exists( 'port', $rest_url_parts ) ) {
                $rest_host .= ':' . $rest_url_parts['port'];
            }

            $current_host = isset( $_SERVER['HTTP_HOST'] ) ? $_SERVER['HTTP_HOST'] : $rest_host;

            if ( $rest_host !== $current_host ) {
                $rest_url = preg_replace( '/' . $rest_host . '/', $current_host, $rest_url, 1 );
            }
        }

        return $rest_url;
    }

    /**
     * Swaps in the Disqus comments list table, which links to the Disqus thread when a
     * synced comment has no matching WordPress post. The filter requires WordPress 6.1.
     *
     * @since    3.1.5
     * @param    string $class_name    The list table class WordPress is about to use.
     * @return   string                The list table class to use.
     */
    public function dsq_filter_comments_list_table_class( $class_name ) {
        if ( 'WP_Comments_List_Table' !== $class_name ) {
            return $class_name;
        }

        require_once plugin_dir_path( __FILE__ ) . 'class-disqus-comments-list-table.php';

        return 'Disqus_Comments_List_Table';
    }

    /**
     * Builds the admin toolbar menu with the various Disqus options
     *
     * @since    3.0
     */
    public function dsq_contruct_admin_menu() {
        if ( ! current_user_can( 'moderate_comments' ) ) {
            return;
        }

        // Replace the existing WordPress comments menu item to prevent confusion
        // about where to administer comments. The Disqus page will have a link to
        // see WordPress comments.
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

    /**
     * Builds the admin menu with the various Disqus options
     *
     * @since    3.0
     * @param    WP_Admin_Bar $wp_admin_bar    Instance of the WP_Admin_Bar.
     */
    public function dsq_construct_admin_bar( $wp_admin_bar ) {
        if ( ! current_user_can( 'moderate_comments' ) ) {
            return;
        }

        // Replace the existing WordPress comments menu item to prevent confusion
        // about where to administer comments. The Disqus page will have a link to
        // see WordPress comments.
        $wp_admin_bar->remove_node( 'comments' );

        $disqus_node_args = array(
            'id' => 'disqus',
            'title' => '<span class="ab-icon"></span>Disqus',
            'href' => admin_url( 'admin.php?page=disqus' ),
            'meta' => array(
                'class' => 'disqus-menu-bar',
            ),
        );

        $disqus_moderate_node_args = array(
            'parent' => 'disqus',
            'id' => 'disqus_moderate',
            'title' => 'Moderate',
            'href' => $this->get_disqus_admin_url( 'moderate' ),
        );

        $disqus_analytics_node_args = array(
            'parent' => 'disqus',
            'id' => 'disqus_analytics',
            'title' => 'Analytics',
            'href' => $this->get_disqus_admin_url( 'analytics/comments' ),
        );

        $disqus_settings_node_args = array(
            'parent' => 'disqus',
            'id' => 'disqus_settings',
            'title' => 'Settings',
            'href' => $this->get_disqus_admin_url( 'settings/general' ),
        );

        $disqus_configure_node_args = array(
            'parent' => 'disqus',
            'id' => 'disqus_plugin_configure',
            'title' => 'Configure Plugin',
            'href' => admin_url( 'admin.php?page=disqus' ),
        );

        $wp_admin_bar->add_node( $disqus_node_args );
        $wp_admin_bar->add_node( $disqus_moderate_node_args );
        $wp_admin_bar->add_node( $disqus_analytics_node_args );
        $wp_admin_bar->add_node( $disqus_settings_node_args );
        $wp_admin_bar->add_node( $disqus_configure_node_args );
    }

    /**
     * Adds a plugin link to the Disqus entry on the plugin page.
     *
     * @since    3.0
     * @param    array  $links    Links rendered for Disqus entry on the plugin page.
     * @param    string $file     The filename of the link being filtered.
     */
    public function dsq_plugin_action_links( $links, $file ) {
        if ( 'disqus/disqus.php' === $file ) {
            $plugin_links = array(
                '<a href="' . esc_url( get_admin_url( null, 'admin.php?page=disqus' ) ) . '">' .
                    ( '' === $this->shortname ? 'Install' : 'Configure' ) .
                '</a>',
            );
            return array_merge( $links, $plugin_links );
        }
        return $links;
    }

    /**
     * Renders the admin page view from a partial file
     *
     * @since    3.0
     */
    public function dsq_render_admin_index() {
        require_once plugin_dir_path( __FILE__ ) . 'partials/disqus-admin-partial.php';
    }

    /**
     * Utility function get the admin URL with site's shortname.
     *
     * @since    3.0
     * @access   private
     * @param    string $path    The path of the admin page to route to.
     * @return   string          The fully-qualified admin URL for the given path.
     */
    private function get_disqus_admin_url( $path = '' ) {
        return 'https://' . $this->shortname . '.disqus.com/admin/' . ( strlen( $path ) ? $path . '/' : '' );
    }

    /**
     * Utility function get the site's name for display in HTML markup.
     *
     * @since    3.0
     * @access   private
     * @return   string    The escaped name for the given site.
     */
    private function get_site_name() {
        return esc_html( get_bloginfo( 'name' ) );
    }

    /**
	 * Checks the stored `disqus_sync_token` and generates a new one if it doesn't exist.
     * This is used as a secret key for authenticating requests through the REST API.
	 *
	 * @since  3.0.8
	 * @access private
	 */
	private function ensure_sync_token() {
		$existing_token = get_option( 'disqus_sync_token', null );
		if ( empty( $existing_token ) ) {
			update_option( 'disqus_sync_token', bin2hex( random_bytes( 16 ) ) );
		}
	}

    /**
     * Display the free version ads notice in the Disqus admin area.
     *
     * @since    3.1.4
     */
    public function dsq_display_ads_notice() {
        // Only show on Disqus admin page.
        if ( ! isset( $_GET['page'] ) || 'disqus' !== $_GET['page'] ) {
            return;
        }

        // Check if notice has been dismissed by this user.
        $user_id = get_current_user_id();
        $dismissed = get_user_meta( $user_id, 'disqus_ads_notice_dismissed', true );
        if ( $dismissed ) {
            return;
        }

        ?>
        <div class="notice notice-info is-dismissible disqus-ads-notice">
            <p>
                <strong><?php esc_html_e( 'Using the free version of Disqus?', 'disqus' ); ?></strong>
                <?php esc_html_e( 'To keep the service free, ads may appear within the comment section. You can upgrade to a paid plan for an ad-free experience.', 'disqus' ); ?>
                <a href="https://disqus.com/pricing/" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Learn more', 'disqus' ); ?></a>
            </p>
        </div>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                $(document).on('click', '.disqus-ads-notice .notice-dismiss', function() {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'disqus_dismiss_ads_notice',
                            nonce: '<?php echo esc_js( wp_create_nonce( 'disqus_dismiss_ads_notice' ) ); ?>'
                        }
                    });
                });
            });
        </script>
        <?php
    }

    /**
     * AJAX handler to dismiss the ads notice.
     *
     * @since    3.1.4
     */
    public function dsq_dismiss_ads_notice() {
        // Verify nonce.
        if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'disqus_dismiss_ads_notice' ) ) {
            wp_die( 'Security check failed', 'disqus' );
        }

        // Check user capability.
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( 'Unauthorized access', 'disqus' );
        }

        $user_id = get_current_user_id();
        update_user_meta( $user_id, 'disqus_ads_notice_dismissed', true );
        wp_send_json_success();
    }

    /**
     * Whether the comments list can show Disqus thread links for unmatched comments.
     *
     * @since    3.1.5
     * @param    string|null $wp_version    WordPress version to check. Defaults to the running version.
     * @return   boolean                    True when the site is below the required WordPress version.
     */
    public function dsq_needs_wordpress_for_in_response_column( $wp_version = null ) {
        if ( null === $wp_version ) {
            global $wp_version;
        }

        return version_compare( $wp_version, self::COMMENTS_LIST_TABLE_MIN_WP, '<' );
    }

    /**
     * Notify admins on older WordPress that unmatched synced comments may have an empty
     * "In response to" column until they upgrade.
     *
     * @since    3.1.5
     */
    public function dsq_display_in_response_wp_notice() {
        if ( ! current_user_can( 'moderate_comments' ) ) {
            return;
        }

        if ( ! $this->dsq_needs_wordpress_for_in_response_column() ) {
            return;
        }

        $pagenow = isset( $GLOBALS['pagenow'] ) ? $GLOBALS['pagenow'] : '';
        $is_comments_screen = 'edit-comments.php' === $pagenow;
        $is_disqus_screen = isset( $_GET['page'] ) && 'disqus' === $_GET['page'];
        if ( ! $is_comments_screen && ! $is_disqus_screen ) {
            return;
        }

        $user_id = get_current_user_id();
        $dismissed = get_user_meta( $user_id, 'disqus_in_response_wp_notice_dismissed', true );
        if ( $dismissed ) {
            return;
        }

        ?>
        <div class="notice notice-warning is-dismissible disqus-in-response-wp-notice">
            <p>
                <?php
                echo esc_html(
                    sprintf(
                        /* translators: %s: Minimum WordPress version required. */
                        __( 'Synced Disqus comments that do not match a local post may show an empty "In response to" column until this site is running WordPress %s or later. After upgrading, that column can link to the Disqus discussion.', 'disqus' ),
                        self::COMMENTS_LIST_TABLE_MIN_WP
                    )
                );
                ?>
            </p>
        </div>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                $(document).on('click', '.disqus-in-response-wp-notice .notice-dismiss', function() {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'disqus_dismiss_in_response_wp_notice',
                            nonce: '<?php echo esc_js( wp_create_nonce( 'disqus_dismiss_in_response_wp_notice' ) ); ?>'
                        }
                    });
                });
            });
        </script>
        <?php
    }

    /**
     * AJAX handler to dismiss the WordPress version notice for the In response to column.
     *
     * @since    3.1.5
     */
    public function dsq_dismiss_in_response_wp_notice() {
        if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'disqus_dismiss_in_response_wp_notice' ) ) {
            wp_die( 'Security check failed', 'disqus' );
        }

        if ( ! current_user_can( 'moderate_comments' ) ) {
            wp_die( 'Unauthorized access', 'disqus' );
        }

        $user_id = get_current_user_id();
        update_user_meta( $user_id, 'disqus_in_response_wp_notice_dismissed', true );
        wp_send_json_success();
    }
}

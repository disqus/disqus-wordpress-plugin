<?php

/**
 * Provide a login view for the plugin
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin/partials
 */
?>

<!-- Welcome Panel -->
<div class="welcome-panel">
    <div class="welcome-panel-content">
        <p class="about-description">
<<<<<<< HEAD
            <?php dsq_gettext_e( 'Check out what\'s happening on %s', esc_html( get_bloginfo( 'name' ) ) ) ?>
=======
            <?php dsq_gettext_e( 'Check out what\'s happening on %s', $site_name ) ?>
>>>>>>> origin/master
        </p>
        <div class="welcome-panel-column-container">
            <div class="welcome-panel-column">
				<h3>
                    <?php dsq_gettext_e( 'Comments' ) ?>
                </h3>
				<a class="button button-primary button-hero" href="<?php echo $this->get_admin_url_for_forum( 'moderate' ) ?>">
                    <?php dsq_gettext_e( 'Moderate' ) ?>
                </a>
                <p class="description">
                    <a href="<?php echo $this->get_admin_url_for_forum( 'filters/banned' ) ?>" target="_blank">
                        <?php dsq_gettext_e( 'Manage banned users and word filters' ) ?>
                    </a>
                </p>
			</div>
            <div class="welcome-panel-column">
				<h3>
                    <?php dsq_gettext_e( 'Analytics' ) ?>
                </h3>
				<ul>
					<li>
                        <a class="welcome-icon dashicons-megaphone" href="<?php echo $this->get_admin_url_for_forum( 'analytics/comments' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Engagement' ) ?>
                        </a>
                    </li>
                    <li>
                        <a class="welcome-icon dashicons-chart-line" href="<?php echo $this->get_admin_url_for_forum( 'analytics/revenue' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Revenue' ) ?>
                        </a>
                    </li>
                    <li>
                        <a class="welcome-icon dashicons-heart" href="<?php echo $this->get_admin_url_for_forum( 'analytics/content' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Popular Content' ) ?>
                        </a>
                    </li>
				</ul>
			</div>
            <div class="welcome-panel-column">
				<h3>
                    <?php dsq_gettext_e( 'Settings' ) ?>
                </h3>
				<ul>
					<li>
                        <a class="welcome-icon dashicons-admin-appearance" href="<?php echo $this->get_admin_url_for_forum( 'settings/general' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Identity' ) ?>
                        </a>
                    </li>
                    <li>
                        <a class="welcome-icon dashicons-format-chat" href="<?php echo $this->get_admin_url_for_forum( 'settings/community' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Community Rules' ) ?>
                        </a>
                    </li>
                    <li>
                        <a class="welcome-icon dashicons-admin-settings" href="<?php echo $this->get_admin_url_for_forum( 'settings/advanced' ) ?>" target="_blank">
                            <?php dsq_gettext_e( 'Advanced' ) ?>
                        </a>
                    </li>
				</ul>
			</div>
        </div>
    </div>
</div>

<?php if ( current_user_can( 'manage_options' ) )  { ?>

<h2 class="title">
    <?php dsq_gettext_e( 'Plugin Configuration' ) ?>
</h2>

<div class="card">
    <h3>
        <?php dsq_gettext_e( 'Site' ) ?>
    </h3>
    <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-form-site-partial.php'; ?>
</div>

<div class="card">
    <h3>
        <?php dsq_gettext_e( 'Single Sign-on' ) ?>
    </h3>
    <p class="description">
        <?php dsq_gettext_e( 'Allow users to sign in with this site\'s user accounts. This is a premium-level feature and must be enabled for your organization.')  ?>
        <a href="https://help.disqus.com/customer/portal/articles/1148635" target="_blank">
            <?php dsq_gettext_e( 'Learn more' ) ?>
        </a>
    </p>
    <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-form-sso-partial.php'; ?>
</div>

<?php } else { ?>

<p>
    <?php dsq_gettext_e( 'You don\'t have permission to make any changes here. Please contact the site administrator to get access.' ) ?>
</p>

<?php } ?>

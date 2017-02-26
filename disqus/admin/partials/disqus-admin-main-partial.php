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
$shortname = strtolower( get_option( 'disqus_forum_url' ) );
$site_name = esc_html( get_bloginfo( 'name' ) );
?>

<!-- Welcome Panel -->
<div class="welcome-panel">
    <div class="welcome-panel-content">
        <p class="about-description">
            <?php dsq_gettext_e( 'Check out what\'s happening on %s', $site_name ) ?>
        </p>
        <div class="welcome-panel-column-container">
            <div class="welcome-panel-column">
                <h3>
                    <?php dsq_gettext_e( 'Comments' ) ?>
                </h3>
                <p class="description">
                    <?php dsq_gettext_e( 'Read, manage, and engage with comments and people on your site.' ) ?>
                </p>
                <a class="button" href="https://<?php echo $shortname ?>.disqus.com/admin/moderate/" target="_blank">
                    <?php dsq_gettext_e( 'Moderate Comments' ) ?>
                </a>
            </div>
            <div class="welcome-panel-column">
                <h3>
                    <?php dsq_gettext_e( 'Analytics' ) ?>
                </h3>
                <p class="description">
                    <?php dsq_gettext_e( 'Understand your community with engagement analytics, popular content, and more.' ) ?>
                </p>
                <a class="button" href="https://<?php echo $shortname ?>.disqus.com/admin/analytics/comments/" target="_blank">
                    <?php dsq_gettext_e( 'Analyze Engagement' ) ?>
                </a>
            </div>
            <div class="welcome-panel-column">
                <h3>
                    <?php dsq_gettext_e( 'Configure' ) ?>
                </h3>
                <p class="description">
                    <?php dsq_gettext_e( 'Customize %s on your site with identity, appearance, and community options.', 'Disqus' ) ?>
                </p>
                <a class="button" href="https://<?php echo $shortname ?>.disqus.com/admin/settings/general/" target="_blank">
                    <?php dsq_gettext_e( 'Edit Settings' ) ?>
                </a>
            </div>
        </div>
    </div>
</div>


<!-- Plugin configuration -->
<?php if ( current_user_can( 'manage_options' ) )  { ?>

<section class="dsq-configure-group">
    <h2 class="title">
        <?php dsq_gettext_e( 'Plugin Settings' ) ?>
    </h2>
    <div class="card">
        <h3>
            <?php dsq_gettext_e( 'Site' ) ?>
        </h3>
        <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-form-site-partial.php'; ?>

        <hr />

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
</section>

<?php } else { ?>

<p>
    <?php dsq_gettext_e( 'You don\'t have permission to make any changes here. Please contact the site administrator to get access.' ) ?>
</p>

<?php } ?>

<?php

/**
 * Provide a login view for the plugin.
 * Step 1 of the installation process.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin/partials
 */
$site_name = esc_html( get_option( 'blogname' ) );
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<h1 class="title">
    <?php dsq_gettext_e( 'Add %s to %s', 'Disqus', $site_name ) ?>
</h1>

<div class="card">
    <h2 class="title">
        <?php dsq_gettext_e( 'Install %s', 'Disqus' ) ?>
    </h2>
    <p>
        <?php dsq_gettext_e( 'Follow each of the steps below to configure the plugin. You may skip any of the ones you\'ve already completed.' ) ?>
    </p>
    <hr />

    <section class="dsq-admin-config">
        <h3>
            <?php dsq_gettext_e( 'Step 1: Log in or sign up for a %s account', 'Disqus' ) ?>
        </h3>
        <p class="description">
            <?php dsq_gettext_e( 'You will be prompted to login or signup with %s', 'Disqus' ) ?>
        </p>
        <p class="submit">
            <a class="button" href="https://disqus.com/profile/signup/?next=/admin/create/" target="_blank">
                <?php dsq_gettext_e( 'Login' ) ?>
            </a>
        </p>
        <hr />

        <h3>
            <?php dsq_gettext_e( 'Step 2: Create a site' ) ?>
        </h3>
        <p class="description">
            <?php dsq_gettext_e( 'Create a new site or choose one you have already registered with your account.' ) ?>
        </p>
        <p class="submit">
            <a class="button" href="https://disqus.com/admin/create/" target="_blank">
                <?php dsq_gettext_e( 'Register Site' ) ?>
            </a>
        </p>
        <hr />

        <h3>
            <?php dsq_gettext_e( 'Step 3: Get your site shortname' ) ?>
        </h3>
        <p class="description">
            <?php dsq_gettext_e( 'After creating your site, you\'ll be prompted to accept the policy and select your platform. If you have more than one site, choose the one you want to install here by pressing the "Pick a Site" button.' ) ?>
        </p>
        <p class="submit">
            <a class="button" href="https://disqus.com/admin/install/wordpress/" target="_blank">
                <?php dsq_gettext_e( 'Get Shortname' ) ?>

            </a>
        </p>
        <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-configure-partial.php'; ?>

    </section>

</div>

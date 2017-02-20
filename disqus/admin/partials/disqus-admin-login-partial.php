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

?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<h1 class="title">
    Add Disqus to <?php echo get_option( 'blogname' ) ?>
</h1>

<div class="card">
    <h2 class="title">Configure Disqus for <strong><?php echo get_option( 'blogname' ) ?></strong></h2>
    <p>Follow each of the steps below to configure the plugin. You may skip any of the ones you've already completed.</p>
    <hr />

    <section class="dsq-admin-config">
        <h3>Step 1: Log in or sign up for a Disqus account</h3>
        <p class="description">You will be prompted to login or signup with Disqus.</p>
        <p class="submit">
            <a class="button" href="https://disqus.com/profile/signup/?next=/admin/create/" target="_blank">Login</a>
        </p>
        <hr />

        <h3>Step 2: Create a site</h3>
        <p class="description">
            Create a new site or choose one you have already registered with your account.
        </p>
        <p class="submit">
            <a class="button" href="https://disqus.com/admin/create/" target="_blank">Register Site</a>
        </p>
        <hr />

        <h3>Step 3: Get your site shortname</h3>
        <p class="description">
            After creating your site, you'll be prompted to accept the policy and select your platform. If you have more than one site, choose the one you want to install here by pressing the <strong>Pick a Site</strong> button.
        </p>
        <p class="submit">
            <a class="button" href="https://disqus.com/admin/install/wordpress/" target="_blank">Get Shortname</a>
        </p>
        <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-configure-partial.php'; ?>

    </section>

</div>

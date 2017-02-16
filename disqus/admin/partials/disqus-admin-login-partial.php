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
    <h2 class="title">Configure Disqus</h2>
    <p>You may configure this plugin manually if you've already registered a site and a Disqus <a href="https://disqus.com/api/applications/" target="_blank">API Application</a>.</p>
    <hr />

    <section class="dsq-advanced-config">
        <h3>Step 1: Register your site with Disqus</h3>
        <p class="description">You can skip this if you have a site that you want to use already.</p>
        <p class="submit">
            <a class="button button-primary" href="https://disqus.com/admin/create/" target="_blank">Register Site</a>
        </p>
        <hr />

        <h3>Step 2: Create an API Application</h3>
        <p class="description">After you've created it, go to the <strong>Settings</strong> tab for that application and change <strong>Default Access</strong> to <strong>Read, Write, and Manage Forums</strong>.</p>
        <p class="submit">
            <a class="button button-primary" href="https://disqus.com/api/applications/register/" target="_blank">Create Application</a>
        </p>
        <hr />

        <h3>Step 3: Configure the Plugin</h3>
        <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-configure-partial.php'; ?>
    </section>

</div>

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

$callback_url = get_admin_url( null, 'edit-comments.php?page=disqus' );
$oauth_url = 'http://dev.disqus.org:8000/api/oauth/2.0/authorize/' .
    '?scope=read,write' .
    '&response_type=api_key' .
    '&redirect_uri=' . urlencode( $callback_url );

?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<h1 class="title">
    Add Disqus to <?php echo get_option( 'blogname' ) ?>
</h1>

<div class="card">
    <h2 class="title">Configure automatically</h2>
    <p>Authenticate with Disqus and select or register a site to install.</p>
    <p class="submit">
        <a href="<?php echo esc_url( $oauth_url ) ?>" class="button button-primary button-hero">
            <svg class="disqus-icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="30px" height="30px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
                <g id="Layer_2"></g>
                <path fill="#FFFFFF" d="M102.535,167.5c-16.518,0-31.621-6.036-43.298-16.021L30.5,155.405l11.102-27.401
                    c-3.868-8.535-6.038-18.01-6.038-28.004c0-37.277,29.984-67.5,66.971-67.5c36.984,0,66.965,30.223,66.965,67.5
                    C169.5,137.284,139.52,167.5,102.535,167.5z M139.102,99.807v-0.188c0-19.478-13.736-33.367-37.42-33.367h-25.58v67.5h25.201
                    C125.171,133.753,139.102,119.284,139.102,99.807L139.102,99.807z M101.964,117.168h-7.482V82.841h7.482
                    c10.989,0,18.283,6.265,18.283,17.07v0.188C120.247,110.995,112.953,117.168,101.964,117.168z" />
            </svg>
            Log in with Disqus
        </a>
    </p>
</div>

<div class="card">
    <h2 class="title">Configure manually <small>(advanced)</small></h2>
    <p>You may configure this plugin manually if you've already registered a site and a Disqus <a href="https://disqus.com/api/applications/" target="_blank">API Application</a>.</p>
    <hr />

    <p id="advancedConfigButton" class="submit">
        <button type="button" class="button">Show Manual Configuration</button>
    </p>

    <section id="advancedConfigurationSection" style="display:none;">
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

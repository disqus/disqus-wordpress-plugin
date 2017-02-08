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
$shortname = strtolower( get_option( 'dsq_shortname' ) );
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<h1>Disqus is Installed.</h1>
<ul>
    <li>
        <a href="https://<?php echo $shortname ?>.disqus.com/admin/moderate/" target="_blank">
            Moderate Comments
        </a>
    </li>
    <li>
        <a href="https://<?php echo $shortname ?>.disqus.com/admin/settings/general/" target="_blank">
            General/Appearance Settings
        </a>
    </li>
    <li>
        <a href="https://<?php echo $shortname ?>.disqus.com/admin/settings/community/" target="_blank">
            Community Settings
        </a>
    </li>
</ul>


<!-- Plugin configuration -->
<?php if ( current_user_can( 'manage_options' ) )  { ?>

<div class="card">
    <h2 class="title">Configuration <small>(advanced)</small></h2>
    <p>Warning: Changing these values may break plugin features or cause commenting to stop working.</p>
    <p id="advancedConfigButton" class="submit">
        <button type="button" class="button">Show Configuration Options</button>
    </p>
    <section id="advancedConfigurationSection" style="display:none;">
        <?php require_once plugin_dir_path( __FILE__ ) . 'disqus-admin-configure-partial.php'; ?>
    </section>
</div>

<h1>Options</h1>

<form id="resetForm" action="" method="post">
    <!-- TODO add nonce and check it -->
    <input type="hidden" name="action" value="reset" />
    <input type="submit" value="Reset Configuration" />
</form>

<?php } else { ?>

<p>You don't have permission to make any changes here. Please contact the site administrator to get access.</p>

<?php } ?>

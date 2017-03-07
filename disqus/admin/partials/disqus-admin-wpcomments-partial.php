<?php

/**
 * Renders a card which displays a link to the old comments page
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin/partials
 */
?>

<div class="card">
    <h2 class="title">
        <?php dsq_gettext_e( 'WordPress Comments' ) ?>
    </h2>
    <div class="notice notice-info inline">
        <p>
            <?php dsq_gettext_e( '%s has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in %s.', 'Disqus', 'Disqus' ); ?>
        </p>
    </div>
    <p class="submit">
        <a class="button button-small" href="<?php echo get_admin_url( null, 'edit-comments.php' ) ?>">
            <?php dsq_gettext_e( 'View WordPress Comments' ) ?>
        </a>
    </p>
</div>

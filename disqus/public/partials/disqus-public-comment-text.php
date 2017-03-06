<?php

/**
 * Markup which will replace the WordPress count link text.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/public/partials
 */

?>

<span class="dsq-postid" data-dsqidentifier="<?php echo esc_attr( $this->dsq_identifier_for_post( $post ) ) ?>">
    <?php echo $comment_text ?>
</span>

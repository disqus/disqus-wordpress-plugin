<?php

/**
 * A partial view for the Disqus plugin configuration form.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin/partials
 */

?>

<form id="advancedConfigForm" name="site" action="" method="POST">
    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <label for="shortname">
                        <?php dsq_gettext_e( 'Shortname' ) ?>
                    </label>
                </th>
                <td>
                    <input type="text" id="shortname" name="disqus_forum_url" value="<?php echo esc_attr( $this->shortname ) ?>" class="regular-text" />
                    <p class="description">
                        <?php dsq_gettext_e( 'Your site\'s unique identifier' ) ?>
                        <a href="https://help.disqus.com/customer/portal/articles/466208" target="_blank">
                            <?php dsq_gettext_e( 'What is this?' ) ?>
                        </a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="submit">
        <input type="submit" name="submit-site-form" id="submit" class="button button-primary" value="<?php dsq_gettext_e( 'Save' ) ?>" />
    </p>
    <?php wp_nonce_field( 'dsq_admin_nonce', 'dsq_admin_nonce' ); ?>
</form>

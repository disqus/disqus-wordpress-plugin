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

<form id="advancedConfigForm" action="" method="POST">
    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <label for="shortname">Site Shortname</label>
                </th>
                <td>
                    <input type="text" id="shortname" name="disqus_forum_url" value="<?php echo esc_attr( get_option( 'disqus_forum_url' ) ) ?>" class="regular-text" />
                    <p class="description">Your site's unique identifier <a href="https://help.disqus.com/customer/portal/articles/466208" target="_blank">What is this?</a>.</p>
                </td>
            </tr>
            <!-- Enable when SSO works
            <tr>
                <th scope="row">
                    <label for="apikey">API Public Key <small>(optional)</small></label>
                </th>
                <td>
                    <input type="text" id="apikey" name="disqus_public_key" value="<?php echo esc_attr( get_option( 'disqus_public_key' ) ) ?>" class="regular-text" />
                    <p class="description">The <strong>Public Key</strong> of your <a href="https://disqus.com/api/applications" target="_blank">API Application</a>.</p>
                </td>
            </tr>
            -->
        </tbody>
    </table>
    <p class="submit">
        <input type="submit" name="submit" id="submit" class="button button-primary" value="Save" />
    </p>
    <?php wp_nonce_field( 'dsq_admin_nonce', 'dsq_admin_nonce' ); ?>
</form>

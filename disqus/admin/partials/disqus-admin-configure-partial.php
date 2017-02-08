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
    <!-- TODO add nonce and check it -->
    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <label for="shortname">Site Shortname</label>
                </th>
                <td>
                    <input type="text" id="shortname" name="dsq_shortname" value="<?php echo esc_attr( get_option( 'dsq_shortname' ) ) ?>" class="regular-text" />
                    <p class="description">Your site's unique <a href="https://help.disqus.com/customer/portal/articles/466208" target="_blank">shortname</a>.</p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="apikey">API Public Key</label>
                </th>
                <td>
                    <input type="text" id="apikey" name="dsq_api_key" value="<?php echo esc_attr( get_option( 'dsq_api_key' ) ) ?>" class="regular-text" />
                    <p class="description">The <strong>Public Key</strong> of your API Application.</p>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="submit">
        <input type="submit" name="submit" id="submit" class="button button-primary" value="Save" />
    </p>
</form>

<?php

/**
 * A partial view for the Disqus plugin SSO config form.
 *
 * @link       https://disqus.com
 * @since      1.0.0
 *
 * @package    Disqus
 * @subpackage Disqus/admin/partials
 */

?>

<form id="ssoConfigForm" action="" method="POST">
    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <label for="ssoenabled">
                        <?php dsq_gettext_e( 'Enable SSO' ) ?>
                    </label>
                </th>
                <td>
                    <input type="checkbox" id="ssoenabled" name="disqus_sso_enabled" <?php if( get_option( 'disqus_sso_enabled' ) ) { echo 'checked="checked"'; } ?> />
                    <p class="description">
                        <?php dsq_gettext_e( 'This will enable Single Sign-on for this site, if already enabled for your Disqus organization.' ) ?>
                    </p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="apikey">
                        <?php dsq_gettext_e( 'API Public Key' ) ?>
                    </label>
                </th>
                <td>
                    <input type="text" id="apikey" name="disqus_public_key" value="<?php echo esc_attr( get_option( 'disqus_public_key' ) ) ?>" class="regular-text" />
                    <p class="description">
                        <?php dsq_gettext_e( 'The public key of your application.' ) ?>
                        <a href="https://disqus.com/api/applications" target="_blank">
                            <?php dsq_gettext_e( 'View your applications' ) ?>
                        </a>
                    </p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="secretkey">
                        <?php dsq_gettext_e( 'API Secret Key' ) ?>
                    </label>
                </th>
                <td>
                    <input type="text" id="secretkey" name="disqus_secret_key" value="<?php echo esc_attr( get_option( 'disqus_secret_key' ) ) ?>" class="regular-text" />
                    <p class="description">
                        <?php dsq_gettext_e( 'The secret key of your application.' ) ?>
                        <a href="https://disqus.com/api/applications" target="_blank">
                            <?php dsq_gettext_e( 'View your applications' ) ?>
                        </a>
                    </p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="loginbutton">
                        <?php dsq_gettext_e( 'Custom Login Button' ) ?>
                    </label>
                </th>
                <td>
                    <input type="url" id="loginbutton" name="disqus_sso_button" value="<?php echo esc_attr( get_option( 'disqus_sso_button' ) ) ?>" class="regular-text" />
                    <p class="description">
                        <?php dsq_gettext_e( 'A link to a .png, .gif, or .jpg image to shown in the comments embed as a button.' ) ?>
                        <a href="https://help.disqus.com/customer/portal/articles/236206#sso-login-button" target="_blank">
                            <?php dsq_gettext_e( 'Learn more' ) ?>
                        </a>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="submit">
        <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php dsq_gettext_e( 'Save' ) ?>" />
    </p>
    <?php wp_nonce_field( 'dsq_admin_nonce', 'dsq_admin_nonce' ); ?>
</form>

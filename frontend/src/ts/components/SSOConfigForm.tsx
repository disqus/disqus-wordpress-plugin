import * as React from 'react';
import { FormProps } from './FormProps';

const SSOConfigForm = (props: FormProps) =>
    <form name="sso" action="" method="POST" onSubmit={props.onSubmit}>
        <table className="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_sso_enabled">
                            {__('Enable SSO')}
                        </label>
                    </th>
                    <td>
                        <input
                            type="checkbox"
                            id="localSSOEnabled"
                            name="disqus_sso_enabled"
                            checked={Boolean(props.localSSOEnabled)}
                            onChange={props.onInputChange.bind(null, 'localSSOEnabled')}
                        />
                        <p className="description">
                            {__('This will enable Single Sign-on for this site, if already enabled for your Disqus organization.')}
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_sso_button">
                            {__('Custom Login Button')}
                        </label>
                    </th>
                    <td>
                        <input
                            type="url"
                            id="localSSOButton"
                            name="disqus_sso_button"
                            className="regular-text"
                            value={props.localSSOButton}
                            onChange={props.onInputChange.bind(null, 'localSSOButton')}
                        />
                        <p className="description">
                            {__('A link to a .png, .gif, or .jpg image to show as a button in Disqus.')}
                            {' '}
                            <a
                                href="https://help.disqus.com/customer/portal/articles/236206#sso-login-button"
                                target="_blank"
                            >
                                {__('Learn More')}
                            </a>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p className="submit">
            <input
                type="submit"
                name="submit-application-form"
                className="button button-primary"
                value={__('Save')}
                />
        </p>
    </form>;

export default SSOConfigForm;

import * as React from 'react';
import { FormProps } from './FormProps';

const SiteConfigForm = (props: FormProps) =>
    <form name="site" action="" method="POST" onSubmit={props.onSubmit}>
        <table className="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="localShortname">{__('Shortname')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="localShortname"
                            name="disqus_forum_url"
                            className="regular-text"
                            value={props.localShortname}
                            onChange={props.onInputChange.bind(null, 'localShortname')}
                            readOnly={Boolean(props.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('Your site\'s unique identifier')}
                            {' '}
                            <a href="https://help.disqus.com/customer/portal/articles/466208" target="_blank">
                                {__('What is this?')}
                            </a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="localPublicKey">{__('API Public Key')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="localPublicKey"
                            name="disqus_public_key"
                            className="regular-text"
                            value={props.localPublicKey}
                            onChange={props.onInputChange.bind(null, 'localPublicKey')}
                            readOnly={Boolean(props.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The public key of your application (optional).')}
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="localSecretKey">{__('API Secret Key')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="localSecretKey"
                            name="disqus_secret_key"
                            className="regular-text"
                            value={props.localSecretKey}
                            onChange={props.onInputChange.bind(null, 'localSecretKey')}
                            readOnly={Boolean(props.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The secret key of your application (optional).')}
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="localAdminAccessToken">{__('API Access Token')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="localAdminAccessToken"
                            name="disqus_admin_access_token"
                            className="regular-text"
                            value={props.localAdminAccessToken}
                            onChange={props.onInputChange.bind(null, 'localAdminAccessToken')}
                            readOnly={Boolean(props.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The admin access token of your application (optional).')}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p className="submit">
            {props.isSiteFormLocked ?
                <button
                    className="button"
                    onClick={props.onToggleState.bind(null, 'isSiteFormLocked')}
                >
                    <i className="genericon genericon-lock" />{' '}{__('Update Manually')}
                </button> :
                <input
                    type="submit"
                    name="submit-site-form"
                    className="button button-primary"
                    value={__('Save')}
                />
            }
        </p>
    </form>;

export default SiteConfigForm;

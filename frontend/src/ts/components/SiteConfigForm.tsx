import * as React from 'react';
import { IFormProps } from './FormProps';

const getSubmitButton = (props: IFormProps): React.ReactNode => {
    return props.data.isSiteFormLocked ? (
        <button
            className="button button-link"
            onClick={props.onToggleState.bind(null, 'isSiteFormLocked')}
        >
            <span className="dashicons dashicons-lock" />{' '}{__('Click to make changes')}
        </button>
    ) : (
        <input
            type="submit"
            name="submit-site-form"
            className="button button-primary"
            value={__('Save')}
        />
    );
};

const SiteConfigForm = (props: IFormProps) => (
    <form name="site" action="" method="POST" onSubmit={props.onSubmit}>
        <table className="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_forum_url">{__('Shortname')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="disqus_forum_url"
                            name="disqus_forum_url"
                            className="regular-text"
                            value={props.data.localAdminOptions.get('disqus_forum_url') || ''}
                            onChange={props.onInputChange.bind(null, 'disqus_forum_url')}
                            readOnly={Boolean(props.data.isSiteFormLocked)}
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
                        <label htmlFor="disqus_public_key">{__('API Public Key')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="disqus_public_key"
                            name="disqus_public_key"
                            className="regular-text"
                            value={props.data.localAdminOptions.get('disqus_public_key') || ''}
                            onChange={props.onInputChange.bind(null, 'disqus_public_key')}
                            readOnly={Boolean(props.data.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The public key of your application (optional).')}
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_secret_key">{__('API Secret Key')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="disqus_secret_key"
                            name="disqus_secret_key"
                            className="regular-text"
                            value={props.data.localAdminOptions.get('disqus_secret_key') || ''}
                            onChange={props.onInputChange.bind(null, 'disqus_secret_key')}
                            readOnly={Boolean(props.data.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The secret key of your application (optional).')}
                        </p>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_admin_access_token">{__('API Access Token')}</label>
                    </th>
                    <td>
                        <input
                            type="text"
                            id="disqus_admin_access_token"
                            name="disqus_admin_access_token"
                            className="regular-text"
                            value={props.data.localAdminOptions.get('disqus_admin_access_token') || ''}
                            onChange={props.onInputChange.bind(null, 'disqus_admin_access_token')}
                            readOnly={Boolean(props.data.isSiteFormLocked)}
                        />
                        <p className="description">
                            {__('The admin access token of your application (optional).')}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p className="submit">
            {getSubmitButton(props)}
        </p>
    </form>
);

export default SiteConfigForm;

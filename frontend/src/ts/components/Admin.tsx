import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    SiteConfigContainer,
    SSOConfigContainer,
    SyncConfigContainer,
} from '../containers';
import { IAdminState } from '../reducers/AdminState';
import { getForumAdminUrl, getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import { IFormProps } from './FormProps';
import WelcomePanel from './WelcomePanel';

const getSSOContainer = (props: IFormProps) => {
    const adminOptions = props.data.adminOptions;
    if (!adminOptions.disqus_public_key || !adminOptions.disqus_secret_key) {
        return (
            <div className="notice notice-warning">
                <p>
                    <span className="dashicons dashicons-warning" />
                    {' '}
                    {__('You must have an API Public Key and API Secret Key configured to enable this feature.')}
                </p>
            </div>
        );
    }
    return <SSOConfigContainer />;
};

const getSyncContainer = (props: IFormProps) => {
    const adminOptions = props.data.adminOptions;
    if (!adminOptions.disqus_secret_key || !adminOptions.disqus_admin_access_token) {
        return (
            <div className="notice notice-warning">
                <p>
                    <span className="dashicons dashicons-warning" />
                    {' '}
                    {__('You must have an API Secret Key and API Access Token configured to enable this feature.')}
                </p>
            </div>
        );
    }

    return <SyncConfigContainer />;
};

/* tslint:disable:max-line-length */
const Admin = (props: IFormProps) => (
    <div>
        <WelcomePanel shortname={props.data.adminOptions.disqus_forum_url} />
        <h2 className="title">
            {__('Plugin Settings')}
        </h2>
        <div>
            <AdminCard title={__('Site Configuration')}>
                <p className="description">
                    {__('Your site configuration comes from Disqus. Changing these values may break your installation.')}
                    {' '}
                    <a
                        href={getForumAdminUrl(props.data.adminOptions.disqus_forum_url, 'install/platforms/wordpress')}
                        target="_blank"
                    >
                        {__('WordPress install instructions')}
                    </a>
                </p>
                <SiteConfigContainer />
            </AdminCard>
            <AdminCard title={__('Single Sign-on')}>
                <p className="description">
                    {__('Allow users to sign in with this site\'s user accounts. This is a premium-level feature and must be enabled for your organization.')}
                    {' '}
                    <a href="https://disqus.com/api/applications/" target="_blank">
                        {__('Learn More')}
                    </a>
                </p>
                {getSSOContainer(props)}
            </AdminCard>
            <AdminCard title={__('WordPress Comments')}>
                <p className="description">
                    {__('Disqus has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in Disqus.')}
                </p>
                <p className="submit">
                    <a
                        href={getWordpressAdminUrl('editComments')}
                        className="button"
                    >
                        {__('View WordPress Comments')}
                    </a>
                </p>
                <hr />
                <h3>
                    {__('Syncing')}
                </h3>
                <p className="description">
                    {__('Syncing will copy comments created and edited in Disqus to your local WordPress database for backup purposes. This will create additional work for your database/server and is not recommended for busy communities.')}
                </p>
                {getSyncContainer(props)}
            </AdminCard>
        </div>
    </div>
);
/* tslint:enable:max-line-length */

export default Admin;

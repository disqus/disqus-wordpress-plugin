import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    InstallContainer,
    SiteConfigContainer,
    SSOConfigContainer,
    SupportDiagnosticsContainer,
    SyncConfigContainer,
} from '../containers';
import { IAdminState } from '../reducers/AdminState';
import { getForumAdminUrl, getWordpressAdminUrl } from '../utils';
import { IFormProps } from './FormProps';
import SupportLinks from './SupportLinks';
import WelcomePanel from './WelcomePanel';

const getSSOContainer = (props: IFormProps) => {
    const adminOptions = props.data.adminOptions;
    if (!adminOptions.disqus_public_key || !adminOptions.disqus_secret_key) {
        return (
            <div className='notice notice-warning'>
                <p>
                    <span className='dashicons dashicons-warning' />
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
            <div className='notice notice-warning'>
                <p>
                    <span className='dashicons dashicons-warning' />
                    {' '}
                    {__('You must have an API Secret Key and API Access Token configured to enable this feature.')}
                </p>
            </div>
        );
    }

    return <SyncConfigContainer />;
};

const getActiveTab = (props: IFormProps) => (
    props.data.activeTab || (props.data.adminOptions.disqus_installed ? 'siteConfiguration' : 'install')
);

const getTabClassName = (props: IFormProps, id: string) => {
    const activeTab = getActiveTab(props);
    return `nav-tab${activeTab === id ? ' nav-tab-active' : ''}`;
};

const AdminTabBar = (props: IFormProps) => (
    <div className='nav-tab-wrapper'>
        <a href="#install" className={getTabClassName(props, 'install')}>
            {props.data.adminOptions.disqus_installed ? __('Reinstall') : __('Install')}
        </a>
        <a href='#siteConfiguration' className={getTabClassName(props, 'siteConfiguration')}>
            {__('Site Configuration')}
        </a>
        <a href='#syncingImporting' className={getTabClassName(props, 'syncingImporting')}>
            {__('Syncing & Importing')}
        </a>
        <a href='#singleSignOn' className={getTabClassName(props, 'singleSignOn')}>
            {__('Single Sign-on')}
        </a>
        <a href='#support' className={getTabClassName(props, 'support')}>
            {__('Support')}
        </a>
    </div>
);

/* tslint:disable:max-line-length */
const getActiveTabView = (props: IFormProps) => {
    const activeTab = getActiveTab(props);
    switch (activeTab) {
    case 'syncingImporting':
        return (
            <div>
                <h3>
                    {__('WordPress Comments')}
                </h3>
                <p className='description'>
                    {__('Disqus has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in Disqus.')}
                </p>
                <p className='submit'>
                    <a
                        href={getWordpressAdminUrl('editComments')}
                        className='button'
                    >
                        {__('View WordPress Comments')}
                    </a>
                </p>
                <hr />
                <h3>
                    {__('Syncing')}
                </h3>
                <p className='description'>
                    {__('Syncing will copy comments created and edited in Disqus to your local WordPress database for backup purposes. This will create additional work for your database/server and may not be recommended for highly active communities.')}
                </p>
                {getSyncContainer(props)}
            </div>
        );
    case 'singleSignOn':
        return (
            <div>
                <h3>
                    {__('Set up Single Sign-on')}
                </h3>
                <p className='description'>
                    {__('Allow users to sign in with this site\'s user accounts. This is a Disqus Pro feature.')}
                    {' '}
                    <a href='https://help.disqus.com/customer/portal/articles/1148635' target='_blank'>
                        {__('Learn More')}
                    </a>
                </p>
                {getSSOContainer(props)}
            </div>
        );
    case 'support':
        return (
            <div>
                <h3>
                    {__('Support Links')}
                </h3>
                <SupportLinks />
                <hr />
                <h3>
                    {__('Diagnostic Information')}
                </h3>
                <p className='description'>
                    {__('Include the following information in any private support requests, but do not share this publicly.')}
                </p>
                <div className='submit'>
                    <SupportDiagnosticsContainer />
                </div>
            </div>
        );
    case 'install':
        return <InstallContainer />;
    case 'siteConfiguration':
    default:
        return (
            <div>
                <h3>
                    {__('Site Configuration')}
                </h3>
                <p className='description'>
                    {__('Your site configuration comes from Disqus. Changing these values may break your installation.')}
                    {' '}
                    <a
                        href={getForumAdminUrl(props.data.adminOptions.disqus_forum_url, 'install/platforms/wordpress')}
                        target='_blank'
                    >
                        {__('WordPress install instructions')}
                    </a>
                </p>
                <SiteConfigContainer />
            </div>
        );
    }
};

const Admin = (props: IFormProps) => (
    <div>
        <WelcomePanel shortname={props.data.adminOptions.disqus_forum_url} />
        <AdminTabBar {...props} />
        {getActiveTabView(props)}
    </div>
);
/* tslint:enable:max-line-length */

export default Admin;

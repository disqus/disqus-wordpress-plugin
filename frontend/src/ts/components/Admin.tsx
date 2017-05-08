import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    SiteConfigContainer,
    SSOConfigContainer,
    SyncConfigContainer,
    SyncEnableButtonContainer,
} from '../containers';
import { IAdminState } from '../reducers/AdminState';
import { getForumAdminUrl, getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import { IFormProps } from './FormProps';
import WelcomePanel from './WelcomePanel';

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
                <SSOConfigContainer />
            </AdminCard>
            <AdminCard title={__('WordPress Comments')}>
                <p className="description">
                    {__('Disqus has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in Disqus.')}
                    {' '}
                    <a href={getWordpressAdminUrl('editComments')}>
                        {__('View WordPress Comments')}
                    </a>
                </p>
                {props.data.adminOptions.disqus_sync_activated ? <SyncConfigContainer /> : <SyncEnableButtonContainer />}
            </AdminCard>
        </div>
    </div>
);
/* tslint:enable:max-line-length */

export default Admin;

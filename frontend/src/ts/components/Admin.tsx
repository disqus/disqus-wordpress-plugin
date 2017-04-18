import * as React from 'react';
import { getForumAdminUrl, getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import SiteConfigForm from './SiteConfigForm';
import SSOConfigForm from './SSOConfigForm';
import SyncConfigForm from './SyncConfigForm';
import WelcomePanel from './WelcomePanel';
import { FormProps } from './FormProps';

const Admin = (props: FormProps) =>
    <div>
        <WelcomePanel shortname={props.adminOptions.disqus_forum_url} />
        <h2 className="title">
            {__('Plugin Settings')}
        </h2>
        <div>
            <AdminCard title={__('Site Configuration')}>
                <p className="description">
                    {__('Your site configuration comes from Disqus. Changing these values may break your installation.')}
                    {' '}
                    <a
                        href={getForumAdminUrl(props.adminOptions.disqus_forum_url, 'install/platforms/wordpress')}
                        target="_blank"
                    >
                        {__('WordPress install instructions')}
                    </a>
                </p>
                <SiteConfigForm {...props} />
            </AdminCard>
            <AdminCard title={__('Single Sign-on')}>
                <p className="description">
                    {__('Allow users to sign in with this site\'s user accounts. This is a premium-level feature and must be enabled for your organization.')}
                    {' '}
                    <a href="https://disqus.com/api/applications/" target="_blank">
                        {__('Learn More')}
                    </a>
                </p>
                <SSOConfigForm {...props} />
            </AdminCard>
            <AdminCard title={__('WordPress Comments')}>
                <p className="description">
                    {__('Disqus has replaced the default WordPress commenting system. You may access and edit the comments in your database, but any actions performed there will not be reflected in Disqus.')}
                    {' '}
                    <a href={getWordpressAdminUrl('edit-comments')}>
                        {__('View WordPress Comments')}
                    </a>
                </p>
                <SyncConfigForm {...props} />
            </AdminCard>
        </div>
    </div>;

export default Admin;

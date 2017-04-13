import React from 'react';
import AdminCard from 'components/AdminCard';
import SiteConfigForm from 'components/SiteConfigForm';

const API_BASE = window.DISQUS_WP.rest.base;

const Install = props =>
    <div>
        <AdminCard title={__('Automatic Installation')}>
            <p>
                {__('Visit the Disqus installation page to continue. You will be prompted to create an account or log in, as well as create a new site or choose an existing one.')}
            </p>
            <p className="submit">
                <a
                    className="button button-primary button-hero"
                    href={`https://disqus.com/admin/install/platforms/wordpress/?url=${window.encodeURIComponent(API_BASE)}&token=${window.encodeURIComponent(props.adminOptions.disqus_sync_token)}`}
                    target="_blank"
                >
                    {__('Start Automatic Installation')}
                </a>
            </p>
        </AdminCard>
        <AdminCard title={__('Manual Installation')}>
            <p className="description">
                {__('You may install Disqus manually if you\'re not able to use the automatic installer.')}
            </p>
            <p className="submit">
                <button className="button" onClick={props.onToggleState.bind(null, 'isSiteFormLocked')}>
                    {props.isSiteFormLocked ? __('Show manual installation') : __('Hide manual installation')}
                </button>
            </p>
            {props.isSiteFormLocked ?
                null :
                <SiteConfigForm {...props} />
            }
        </AdminCard>
    </div>;

export default Install;

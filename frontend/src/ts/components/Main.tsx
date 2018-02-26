import * as React from 'react';
import InstallContainer from '../containers/InstallContainer';
import SyncTokenContainer from '../containers/SyncTokenContainer';
import { getWordpressAdminUrl } from '../utils';
import Admin from './Admin';
import { IFormProps } from './FormProps';
import Loading from './Loading';
import Message from './Message';

const PRE_RELEASE_TYPES: any = Object.freeze({
    alpha: 'alpha',
    beta: 'beta',
});

/* tslint:disable:max-line-length */
const getMainView = (props: IFormProps) => {
    if (!props.data.config.permissions.canManageSettings)
        return __('You don\'t have permission to make any changes here. Please contact the site administrator to get access.');
    else if (props.data.isFetchingAdminOptions || props.data.isFetchingSyncStatus)
        return <Loading />;
    else if (!props.data.adminOptions.disqus_sync_token)
        return (
            <div>
                <div className={`notice notice-info inline`}>
                    <p>
                        {__('The plugin was unable to generate a secret key for your site. You will have to create one below in order for installation and syncing to work.')}
                    </p>
                </div>
                <SyncTokenContainer {...props} />
            </div>
        );
    return <Admin {...props} />;
};

const getPreReleaseNotice = (pluginVersion: string) => {
    // Format of versions can be either 1.0.0, 1.0.0-beta, or 1.0.0-beta.1
    const preReleaseType = (pluginVersion.split('-')[1] || '').split('.')[0];
    if (PRE_RELEASE_TYPES[preReleaseType]) {
        return (
            <div className={`notice notice-info inline`}>
                <p>
                    You are using a <strong>pre-release version ({`${pluginVersion}`})</strong> of the Disqus WordPress plugin.
                    {' '}<a href='https://github.com/disqus/disqus-wordpress-plugin/releases' target='_blank'>Check for new releases</a>
                </p>
            </div>
        );
    }
    return null;
};

const Main = (props: IFormProps) => (
    <div className='dsq-admin-wrapper'>
        <div className='wrap'>
            <a href={getWordpressAdminUrl('disqus')} className='disqus-logo'>
                <img
                    src='https://a.disquscdn.com/dotcom/d-2407bda/img/brand/disqus-logo-blue-white.svg'
                    width={102}
                />
            </a>
        </div>
        <div className='wrap'>
            {getPreReleaseNotice(props.data.config.site.pluginVersion)}
            {props.data.message ? <Message {...props.data.message} /> : null}
            {getMainView(props)}
        </div>
    </div>
);
/* tslint:enable:max-line-length */

export default Main;

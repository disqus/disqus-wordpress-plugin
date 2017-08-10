import * as React from 'react';
import { InstallContainer } from '../containers';
import { getWordpressAdminUrl } from '../utils';
import Admin from './Admin';
import { IFormProps } from './FormProps';
import Loading from './Loading';
import Message from './Message';

/* tslint:disable:max-line-length */
const getMainView = (props: IFormProps) => {
    if (!props.data.config.permissions.canManageSettings)
        return __('You don\'t have permission to make any changes here. Please contact the site administrator to get access.');
    else if (props.data.isFetchingAdminOptions || props.data.isFetchingSyncStatus)
        return <Loading />;
    else if (!props.data.adminOptions.disqus_installed)
        return <InstallContainer />;
    return <Admin {...props} />;
};

const Main = (props: IFormProps) => (
    <div className="dsq-admin-wrapper">
        <div className="wrap">
            <a href={getWordpressAdminUrl('disqus')} className="disqus-logo">
                <img
                    src="https://a.disquscdn.com/dotcom/d-2407bda/img/brand/disqus-logo-blue-white.svg"
                    width={102}
                />
            </a>
        </div>
        <div className="wrap">
            <div className={`notice notice-info inline`}>
                <p>
                    You are using a <strong>pre-release version ({`${props.data.config.site.pluginVersion}-beta`})</strong> of the Disqus WordPress plugin.
                    {' '}<a href="https://github.com/ryanvalentin/disqus-wordpress-plugin/releases" target="_blank">Check for new releases</a>
                </p>
            </div>
            {props.data.message ? <Message {...props.data.message} /> : null}
            {getMainView(props)}
        </div>
    </div>
);
/* tslint:enable:max-line-length */

export default Main;

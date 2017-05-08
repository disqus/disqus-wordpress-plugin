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
    else if (props.data.isBusy)
        return <Loading />;
    else if (!props.data.adminOptions.disqus_installed)
        return <InstallContainer />;
    return <Admin {...props} />;
};
/* tslint:enable:max-line-length */

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
            {props.data.message ? <Message {...props.data.message} /> : null}
            {getMainView(props)}
        </div>
    </div>
);

export default Main;

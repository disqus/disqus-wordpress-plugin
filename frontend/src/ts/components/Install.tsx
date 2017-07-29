import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { SiteConfigContainer } from '../containers';
import { IAdminState } from '../reducers/AdminState';
import { IDisqusWordpressWindow } from '../reducers/AdminState';
import { getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import { IFormProps } from './FormProps';

const WIN = window as IDisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP.rest;

/* tslint:disable:max-line-length */
class Install extends React.Component<IFormProps, any> {
    public render() {
        const syncToken = `${REST_OPTIONS.base}settings ${this.props.data.adminOptions.get('disqus_sync_token', '')}`;
        return (
            <div>
                <AdminCard title={__('Automatic Installation')}>
                    <p>
                        {__('Start the registration process and choose the WordPress platform when prompted.')}
                    </p>
                    <table className="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label htmlFor="configKey">{__('Install Key')}</label>
                                </th>
                                <td>
                                    <input
                                        id="configKey"
                                        type="text"
                                        value={syncToken}
                                        className="regular-text"
                                        readOnly={true}
                                    />
                                    <p className="description">
                                        {__('Copy and paste this key in the WordPress installation instructions.')}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="submit">
                        <a
                            className="button button-primary"
                            onClick={this.startAdminInstall.bind(this, syncToken)}
                        >
                            {__('Start Installation')}
                        </a>
                        <br />
                        <br />
                        <em>
                            {__('Already have a site registered?')}
                            {' '}
                            <a href="https://disqus.com/admin/install/platforms/wordpress/">
                                Go to WordPress installation page
                            </a>.
                        </em>
                    </p>
                </AdminCard>
                <AdminCard title={__('Manual Installation')}>
                    <p>
                        {__('You may install Disqus manually if you\'re not able to use the automatic installer.')}
                    </p>
                    <p className="submit">
                        <button className="button button-link" onClick={this.props.onToggleState.bind(null, 'isSiteFormLocked')}>
                            <span className={`dashicons dashicons-arrow-${this.props.data.isSiteFormLocked ? 'right' : 'down'}`} />
                            {' '}
                            {this.props.data.isSiteFormLocked ? __('Show manual configuration') : __('Hide manual configuration')}
                        </button>
                    </p>
                    {this.props.data.isSiteFormLocked ? null : <SiteConfigContainer />}
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
                </AdminCard>
            </div>
        );
    }

    /**
     * Opens a window to the publisher admin installation instructions and initializes communication between them.
     * @param syncToken - The token to send when the installation instructions are ready.
     */
    private startAdminInstall(syncToken: string) {
        const adminUrl: string = `https://disqus.com/admin/install/platforms/wordpressbeta/`;
        const win: Window = window.open(adminUrl);
        const handlePostMessageEvent = (evt: MessageEvent) => {
            if (evt.origin.match(/https:\/\/(\w+).disqus.com/)) {
                switch (evt.data) {
                    case 'installPageReady':
                        // Pass the token information back to the install instructions page.
                        win.postMessage(syncToken, evt.origin);
                        break;
                    case 'configurationUpdated':
                        window.location.reload();
                        break;
                    default:
                        break;
                }
            }
        };
        window.addEventListener('message', handlePostMessageEvent, false);
    }
}
/* tslint:enable:max-line-length */

export default Install;

import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { SiteConfigContainer } from '../containers';
import { IAdminState } from '../reducers/AdminState';
import { IDisqusWordpressWindow } from '../reducers/AdminState';
import { appendQueryToUrl } from '../utils';
import { getWordpressAdminUrl } from '../utils';
import AdminCard from './AdminCard';
import { IFormProps } from './FormProps';

const WIN = window as IDisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP.rest;

/* tslint:disable:max-line-length */
const Install = (props: IFormProps) => (
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
                                value={appendQueryToUrl(`${REST_OPTIONS.base}settings`, `secret=${props.data.adminOptions.get('disqus_sync_token', '')}`)}
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
                    href="https://disqus.com/profile/login/?next=/admin/create/"
                    target="_blank"
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
                <button className="button button-link" onClick={props.onToggleState.bind(null, 'isSiteFormLocked')}>
                    <span className={`dashicons dashicons-arrow-${props.data.isSiteFormLocked ? 'right' : 'down'}`} />
                    {' '}
                    {props.data.isSiteFormLocked ? __('Show manual configuration') : __('Hide manual configuration')}
                </button>
            </p>
            {props.data.isSiteFormLocked ? null : <SiteConfigContainer />}
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
/* tslint:enable:max-line-length */

export default Install;

import * as React from 'react';
import { InstallationState } from '../reducers/AdminState';
import { IDisqusWordpressWindow } from '../reducers/AdminState';
import REST_OPTIONS from '../REST_OPTIONS';
import { IFormProps } from './FormProps';

const DISQUS_URL_BASE: string = 'https://disqus.com/';
const DISQUS_SIGNUP_URL: string = `${DISQUS_URL_BASE}profile/signup/`;
const DISQUS_LOGIN_URL: string = `${DISQUS_URL_BASE}profile/login/`;
const DISQUS_CREATE_URL: string = `${DISQUS_URL_BASE}admin/create/`;
const DISQUS_WORDPRESS_URL: string = `${DISQUS_URL_BASE}admin/install/platforms/wordpress/`;
const SYNCTOKEN_INPUT_ID = 'configKey';

/* tslint:disable:max-line-length */
class Install extends React.Component<IFormProps, any> {
    public render() {
        const syncToken = `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}settings ${this.props.data.adminOptions.get('disqus_sync_token', '')}`;
        return (
            <div>
                <h3>
                    {__('Automatic Installation')}
                </h3>
                <p>
                    {__('Installs Disqus on your site using a generated API application. If your site isn\'t publicly accessible, use the manual installation method.')}
                </p>
                {this.getAutoInstallPrompt(syncToken)}
            </div>
        );
    }

    private getAutoInstallPrompt(syncToken: string) {
        switch (this.props.data.installationState) {
            case InstallationState.none:
                return (
                    <div>
                        <p className='submit'>
                            <strong>{__('Do you have a Disqus account?')}</strong>
                            <br />
                            <button
                                className='button'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.hasAccount)}
                            >
                                {__('Yes')}
                            </button>
                            {' '}
                            <button
                                className='button'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.noAccount)}
                            >
                                {__('No')}
                            </button>
                        </p>
                    </div>
                );
            case InstallationState.hasAccount:
                return (
                    <div>
                        <p className='submit'>
                            <strong>{__('Do you have a site registered on Disqus you want to use?')}</strong>
                            <br />
                            <button
                                className='button'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.hasSite)}
                            >
                                {__('Yes')}
                            </button>
                            {' '}
                            <button
                                className='button'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.noSite)}
                            >
                                {__('No')}
                            </button>
                        </p>
                    </div>
                );
            case InstallationState.noAccount:
                return (
                    <ol className='dsq-installation__instruction-list'>
                        <li>
                            {__('Sign up to register your account and site with Disqus')}
                            <br />
                            <button
                                className='button button-primary button-large'
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_SIGNUP_URL}?next=${encodeURIComponent(DISQUS_CREATE_URL)}`)}
                            >
                                {__('Sign up')}
                            </button>
                        </li>
                        <li>
                            {__('After creating the site, go to the WordPress installation page to finish.')}
                            <br />
                            <button
                                className='button'
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_WORDPRESS_URL)}`)}
                            >
                                {__('WordPress installation page')}
                            </button>
                        </li>
                        <li>
                            {__('If needed, copy the sync token below and paste it to the input field in the installation page')}
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type='text'
                                value={syncToken}
                                className='regular-text'
                                readOnly={true}
                            />
                            <button
                                className='button'
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            {__('Click the Install button and finish configuring your Disqus settings')}
                        </li>
                    </ol>
                );
            case InstallationState.hasSite:
            case InstallationState.reinstallSite:
                let installUrl = DISQUS_WORDPRESS_URL;
                const useExistingSite = this.props.data.installationState === InstallationState.reinstallSite;
                if (useExistingSite)
                    installUrl = installUrl.replace('//disqus.com', `//${this.props.data.adminOptions.disqus_forum_url}.disqus.com`);
                return (
                    <ol className='dsq-installation__instruction-list'>
                        <li>
                            {__('Go to the WordPress installation page')}
                            <br />
                            <button
                                className='button button-primary button-large'
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(installUrl)}`)}
                            >
                                {__('WordPress installation page')}
                            </button>
                        </li>
                        {/* tslint:disable:jsx-no-multiline-js */}
                        {useExistingSite ? null : (
                            <li>
                                {__('When prompted, choose the Disqus site you want to use')}
                            </li>
                        )}
                        {/* tslint:enable:jsx-no-multiline-js */}
                        <li>
                            {__('If needed, copy the sync token below and paste it to the input field in the installation page')}
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type='text'
                                value={syncToken}
                                className='regular-text'
                                readOnly={true}
                            />
                            <button
                                className='button'
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            {__('Click the Install button and finish configuring your Disqus settings')}
                        </li>
                    </ol>
                );
            case InstallationState.noSite:
                return (
                    <ol className='dsq-installation__instruction-list'>
                        <li>
                            {__('Create a new site on Disqus')}
                            <br />
                            <button
                                className='button button-primary button-large'
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_CREATE_URL)}`)}
                            >
                                {__('Create site')}
                            </button>
                        </li>
                        <li>
                            {__('After creating the site, go to the WordPress installation page to finish.')}
                            <br />
                            <button
                                className='button'
                                onClick={this.openDisqusPage.bind(this, syncToken, `${DISQUS_LOGIN_URL}?next=${encodeURIComponent(DISQUS_WORDPRESS_URL)}`)}
                            >
                                {__('WordPress installation page')}
                            </button>
                        </li>
                        <li>
                            {__('If needed, copy the sync token below and paste it to the input field in the installation page')}
                            <br />
                            <input
                                id={SYNCTOKEN_INPUT_ID}
                                type='text'
                                value={syncToken}
                                className='regular-text'
                                readOnly={true}
                            />
                            <button
                                className='button'
                                onClick={this.props.onCopyText.bind(null, SYNCTOKEN_INPUT_ID)}
                            >
                                {__('Copy')}
                            </button>
                        </li>
                        <li>
                            {__('Click the Install button and finish configuring your Disqus settings')}
                        </li>
                    </ol>
                );
            case InstallationState.installed:
                return (
                    <div>
                        <p className='submit'>
                            <strong>{__('Do you want to reinstall this site or a different site?')}</strong>
                        </p>
                        <p>
                            <button
                                className='button button-primary button-large'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.reinstallSite)}
                            >
                                {__('Reinstall')}
                                {' '}
                                <em>{this.props.data.adminOptions.disqus_forum_url}</em>
                            </button>
                            {' '}
                            <button
                                className='button button-large'
                                onClick={this.props.onUpdateInstallationState.bind(null, InstallationState.hasSite)}
                            >
                                {__('Choose a new site')}
                            </button>
                        </p>
                    </div>
                );
            default:
                return null;
        }
    }

    /**
     * Opens a window to the publisher admin installation instructions and initializes communication between them.
     * @param syncToken - The token to send when the installation instructions are ready.
     * @param startUrl - The URL to load initially.
     */
    private openDisqusPage(syncToken: string, startUrl: string) {
        const win: Window = window.open(startUrl);
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

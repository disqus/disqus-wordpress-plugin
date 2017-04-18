import * as React from 'react';
import { getWordpressAdminUrl } from '../utils';
import { restGet, restPut, RestResponse } from '../rest';
import Admin from './Admin';
import Install from './Install';
import Loading from './Loading';
import { MessageProps, default as Message } from './Message';
import { DisqusWPOptions } from '../plugin';

interface AdminOptions {
    disqus_forum_url?: string,
    disqus_public_key?: string,
    disqus_secret_key?: string,
    disqus_admin_access_token?: string,
    disqus_sso_button?: string,
    disqus_sso_enabled?: boolean,
    disqus_manual_sync?: boolean,
    disqus_sync_token?: string,
}

export interface MainProps {
    config: DisqusWPOptions,
}

export interface MainState {
    config: DisqusWPOptions,
    adminOptions: AdminOptions,
    localShortname: string,
    localPublicKey: string,
    localSecretKey: string,
    localAdminAccessToken: string,
    localSSOButton: string,
    localSSOEnabled: boolean,
    localManualSync: boolean,
    message: MessageProps,
    isSiteFormLocked: boolean,
    [key: string]: any,
}


class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.state = {
            config: props.config,
            adminOptions: null,
            localShortname: '',
            localPublicKey: '',
            localSecretKey: '',
            localAdminAccessToken: '',
            localSSOButton: '',
            localSSOEnabled: false,
            localManualSync: false,
            message: null,
            isSiteFormLocked: true,
        };
    }

    componentDidMount() {
        restGet('settings', this.handleAdminOptionsResponse.bind(this));
    }

    saveOptions(data: AdminOptions) {
        restPut('settings', data, (response: RestResponse<AdminOptions>) => {
            this.handleAdminOptionsResponse(response);
            this.addMessage(__('Saved changes successfully.'), 'success');
        });
    }

    handleAdminOptionsResponse(response: RestResponse<AdminOptions>) {
        if (!response)
            return;

        if (response.code !== 'OK') {
            this.addMessage(response.message, 'error');
            return;
        }

        const adminOptions = response.data || {};
        this.setState({
            adminOptions,
            localShortname: adminOptions.disqus_forum_url || '',
            localPublicKey: adminOptions.disqus_public_key || '',
            localSecretKey: adminOptions.disqus_secret_key || '',
            localAdminAccessToken: adminOptions.disqus_admin_access_token || '',
            localSSOButton: adminOptions.disqus_sso_button || '',
            localSSOEnabled: adminOptions.disqus_sso_enabled || false,
            localManualSync: adminOptions.disqus_manual_sync || false,
        });
    }

    handleInputChanged(stateKey: string, evt: React.SyntheticEvent<HTMLInputElement>) {
        const isCheckbox = evt.currentTarget.type === 'checkbox';
        this.setState({
            [stateKey]: isCheckbox ? evt.currentTarget.checked : evt.currentTarget.value,
        });
    }

    handleSubmitForm(evt: React.SyntheticEvent<HTMLFormElement>) {
        evt.preventDefault();

        let fields = {};
        Object.keys(this.state).forEach((currentIdKey: string) => {
            if (currentIdKey in evt.currentTarget.elements) {
                const currentField: Element | HTMLCollection = evt.currentTarget.elements.namedItem(currentIdKey);
                fields = (Object as any).assign(
                    {},
                    fields,
                    { [(currentField as HTMLFormElement).name]: this.state[currentIdKey] }
                );
            }
        });

        this.saveOptions(fields);
    }

    addMessage(messageText: string, type: string) {
        this.setState({
            message: {
                text: messageText,
                type: type,
            },
        });
    }

    handleToggleState(stateKey: string) {
        this.setState({
            [stateKey]: !this.state[stateKey]
        });
    }

    renderMainView() {
        if (!this.props.config.permissions.canManageSettings) {
            return __('You don\'t have permission to make any changes here. Please contact the site administrator to get access.');
        } else if (!this.state.adminOptions) {
            return <Loading />;
        } else if (!this.state.adminOptions.disqus_forum_url) {
            return (
                <Install
                    {...this.state}
                    onInputChange={this.handleInputChanged.bind(this)}
                    onSubmit={this.handleSubmitForm.bind(this)}
                    onToggleState={this.handleToggleState.bind(this)}
                />
            );
        }

        return (
            <Admin
                {...this.state}
                onInputChange={this.handleInputChanged.bind(this)}
                onSubmit={this.handleSubmitForm.bind(this)}
                onToggleState={this.handleToggleState.bind(this)}
            />
        );
    }

    render() {
        return (
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
                    {this.state.message ?
                        <Message {...this.state.message} />
                    : null}
                    {this.renderMainView()}
                </div>
            </div>
        );
    }
}

export default Main;

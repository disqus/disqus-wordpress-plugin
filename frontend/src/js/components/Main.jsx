import React from 'react';
import { getWordpressAdminUrl } from 'utils';
import { restGet, restPut } from 'rest';
import Admin from 'components/Admin';
import Install from 'components/Install';
import Loading from 'components/Loading';
import Message from 'components/Message';

class Main extends React.Component {
    constructor() {
        super();

        this.state = {
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

    saveOptions(data) {
        restPut('settings', data, response => {
            this.handleAdminOptionsResponse(response);
            this.addMessage(__('Saved changes successfully.'));
        });
    }

    handleAdminOptionsResponse(response) {
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

    handleInputChanged(key, evt) {
        const isCheckbox = evt.target.type === 'checkbox';
        this.setState({
            [key]: isCheckbox ? evt.target.checked : evt.target.value,
        });
    }

    handleSubmitForm(evt) {
        evt.preventDefault();

        var fields = {};
        Object.keys(this.state).forEach(currentIdKey => {
            if (currentIdKey in evt.target.elements)
                fields[evt.target.elements[currentIdKey].name] = this.state[currentIdKey];
        });

        this.saveOptions(fields);
    }

    addMessage(messageText, type) {
        this.setState({
            message: {
                text: messageText,
                type: type,
            },
        });
    }

    handleToggleState(stateKey) {
        this.setState({
            [stateKey]: !this.state[stateKey]
        });
    }

    renderMainView() {
        if (!window.DISQUS_WP.permissions.canManageSettings) {
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
                        <Message type={this.state.message.type}>{this.state.message.text}</Message>
                    : null}
                    {this.renderMainView()}
                </div>
            </div>
        );
    }
}

export default Main;

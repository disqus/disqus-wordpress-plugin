import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    setMessageAction,
    toggleValueAction,
    updateAdminOptionsAction,
    updateLocalOptionAction,
    updateSyncStatusAction,
} from './actions';
import Install from './components/Install';
import Main from './components/Main';
import SiteConfigForm from './components/SiteConfigForm';
import SSOConfigForm from './components/SSOConfigForm';
import SupportDiagnostics from './components/SupportDiagnostics';
import SyncConfigForm from './components/SyncConfigForm';
import { IAdminOptions } from './reducers/AdminOptions';
import AdminState from './reducers/AdminState';
import {
    IRestResponse,
    restPost,
} from './rest';

const UPDATABLE_FIELDS: string[] = [
    'disqus_forum_url',
    'disqus_public_key',
    'disqus_secret_key',
    'disqus_admin_access_token',
    'disqus_sso_button',
    'disqus_sso_enabled',
    'disqus_sync_token',
];

const mapStateToProps = (state: AdminState) => {
    return {
        data: state,
    };
};

const valueFromInput = (element: HTMLInputElement): string => {
    const isCheckbox: boolean = element.type === 'checkbox';

    let value: string;
    if (isCheckbox)
        value = element.checked ? '1' : '';
    else
        value = element.value;

    return value;
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<Redux.Action>) => {
    const handleClearMessage = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
        dispatch(setMessageAction(null));
    };
    return {
        onCopyText: (elementId: string): void => {
            try {
                const element: HTMLInputElement = window.document.getElementById(elementId) as HTMLInputElement;
                if (element) {
                    element.select();
                    window.document.execCommand('copy');
                }
            } catch (err) {
                // Continue
            }
        },
        onInputChange: (key: string, event: React.SyntheticEvent<HTMLInputElement>) => {
            const value: string = valueFromInput(event.currentTarget);
            dispatch(updateLocalOptionAction(key, value));
        },
        onSubmitSiteForm: (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            const fields = (UPDATABLE_FIELDS as any).reduce((previousValue: any, currentIdKey: string) => {
                if (currentIdKey in event.currentTarget.elements) {
                    const currentField: Element | HTMLCollection = event.currentTarget.elements.namedItem(currentIdKey);
                    const currentInputElement = currentField as HTMLInputElement;
                    const value: string = valueFromInput(currentInputElement);

                    return (Object as any).assign({
                        [currentInputElement.name]: value,
                    }, previousValue);
                }
                return previousValue;
            }, {});

            restPost('settings', fields, (response: IRestResponse<IAdminOptions>) => {
                if (!response)
                    return;

                if (response.code !== 'OK') {
                    dispatch(setMessageAction({
                        onDismiss: handleClearMessage,
                        text: response.message,
                        type: 'error',
                    }));
                    return;
                }

                dispatch(updateAdminOptionsAction(response.data));
                dispatch(setMessageAction({
                    onDismiss: handleClearMessage,
                    text: __('Changes saved successfully.'),
                    type: 'success',
                }));
            });
        },
        onSubmitSyncConfigForm: (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();

            const endpoint: string = event.currentTarget.name;

            restPost(endpoint, null, (response: IRestResponse<IAdminOptions>) => {
                if (!response)
                    return;

                if (response.code !== 'OK') {
                    dispatch(setMessageAction({
                        onDismiss: handleClearMessage,
                        text: response.message,
                        type: 'error',
                    }));
                    return;
                }

                dispatch(updateSyncStatusAction(response.data));
                dispatch(setMessageAction({
                    onDismiss: handleClearMessage,
                    text: __('Changes saved successfully.'),
                    type: 'success',
                }));
            });
        },
        onToggleState: (key: string) => {
            dispatch(toggleValueAction(key));
        },
    };
};

export const MainContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);

export const InstallContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(Install);

export const SiteConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SiteConfigForm);

export const SSOConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SSOConfigForm);

export const SupportDiagnosticsContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SupportDiagnostics);

export const SyncConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SyncConfigForm);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    setMessageAction,
    setValueAction,
    updateAdminOptionsAction,
    updateSyncStatusAction,
} from './actions';
import { MainContainer } from './containers';
import adminApp from './reducers/adminApp';
import { IAdminOptions } from './reducers/AdminOptions';
import AdminState from './reducers/AdminState';
import { ISyncStatus } from './reducers/SyncStatus';
import { IRestResponse, restGet } from './rest';

const store = Redux.createStore<AdminState>(adminApp);

const element: HTMLElement = document.getElementById('disqus-admin');

const onClearMessage = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
    store.dispatch(setMessageAction(null));
};

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <MainContainer />
    </ReactRedux.Provider>,
    element,
    () => {
        const checkResponse = (response: IRestResponse<any>): boolean => {
            if (!response)
                return false;

            if (response.code !== 'OK') {
                store.dispatch(setMessageAction({
                    onDismiss: onClearMessage,
                    text: response.message,
                    type: 'error',
                }));
                return false;
            }

            return true;
        };

        store.dispatch(setValueAction('isFetchingAdminOptions', true));
        store.dispatch(setValueAction('isFetchingSyncStatus', true));

        // Fetch the admin options
        restGet('settings', (response: IRestResponse<IAdminOptions>) => {
            store.dispatch(setValueAction('isFetchingAdminOptions', false));

            if (!checkResponse(response))
                return;

            store.dispatch(updateAdminOptionsAction(response.data));
        });

        // Fetch the sync status
        restGet('sync/status', (response: IRestResponse<ISyncStatus>) => {
            store.dispatch(setValueAction('isFetchingSyncStatus', false));

            if (!checkResponse(response))
                return;

            store.dispatch(updateSyncStatusAction(response.data));
        });
    },
);

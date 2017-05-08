import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {
    setMessageAction,
    setValueAction,
    updateAdminOptionsAction,
} from './actions';
import { MainContainer } from './containers';
import adminApp from './reducers/adminApp';
import { IAdminOptions } from './reducers/AdminOptions';
import AdminState from './reducers/AdminState';
import { IRestResponse, restGet } from './rest';

const store = Redux.createStore<AdminState>(adminApp);

const element: HTMLElement = document.getElementById('disqus-admin');

ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <MainContainer />
    </ReactRedux.Provider>,
    element,
    () => {
        store.dispatch(setValueAction('isBusy', true));
        // Fetch the initial data
        restGet('settings', (response: IRestResponse<IAdminOptions>) => {
            store.dispatch(setValueAction('isBusy', false));

            if (!response)
                return;

            if (response.code !== 'OK') {
                store.dispatch(setMessageAction({ text: response.message, type: 'error' }));
                return;
            }

            store.dispatch(updateAdminOptionsAction(response.data));
        });
    },
);

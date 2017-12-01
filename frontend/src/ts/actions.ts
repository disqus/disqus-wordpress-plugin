import { IMessage, InstallationState } from './reducers/AdminState';

export interface IAction {
    type: string;
    data: any;
}

export const UPDATE_ADMIN_OPTIONS: string = 'UPDATE_ADMIN_OPTIONS';
export const UPDATE_SYNC_STATUS: string = 'UPDATE_SYNC_STATUS';
export const TOGGLE_VALUE: string = 'TOGGLE_VALUE';
export const SET_VALUE: string = 'SET_VALUE';
export const UPDATE_LOCAL_OPTION: string = 'UPDATE_LOCAL_OPTION';
export const SET_MESSAGE: string = 'SET_MESSAGE';
export const CHANGE_INSTALL_STATE: string = 'CHANGE_INSTALL_STATE';
export const CHANGE_TAB_STATE: string = 'CHANGE_TAB_STATE';

export function updateAdminOptionsAction(data: any): IAction {
    return {
        data,
        type: UPDATE_ADMIN_OPTIONS,
    };
}

export function updateLocalOptionAction(key: string, newValue: string): IAction {
    return {
        data: {
            [key]: newValue,
        },
        type: UPDATE_LOCAL_OPTION,
    };
}

export function updateSyncStatusAction(data: any): IAction {
    return {
        data,
        type: UPDATE_SYNC_STATUS,
    };
}

export function toggleValueAction(key: string): IAction {
    return {
        data: key,
        type: TOGGLE_VALUE,
    };
}

export function setValueAction(key: string, newValue: any): IAction {
    return {
        data: {
            [key]: newValue,
        },
        type: SET_VALUE,
    };
}

export function setMessageAction(message: IMessage): IAction {
    return {
        data: message,
        type: SET_MESSAGE,
    };
}

export function changeInstallStateAction(state: InstallationState): IAction {
    return {
        data: state,
        type: CHANGE_INSTALL_STATE,
    };
}

export function changeTabStateAction(tab: string): IAction {
    return {
        data: tab,
        type: CHANGE_TAB_STATE,
    };
}

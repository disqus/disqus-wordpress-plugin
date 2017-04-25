import { IMessage } from './reducers/AdminState';

export interface IAction {
    type: string;
    data: any;
}

export const UPDATE_ADMIN_OPTIONS: string = 'UPDATE_ADMIN_OPTIONS';
export const TOGGLE_LOCAL_OPTION: string = 'TOGGLE_LOCAL_OPTION';
export const UPDATE_LOCAL_OPTION: string = 'UPDATE_LOCAL_OPTION';
export const SET_MESSAGE: string = 'SET_MESSAGE';

export function updateAdminOptionsAction(data: any): IAction {
    return {
        data,
        type: UPDATE_ADMIN_OPTIONS,
    };
}

export function toggleLocalOptionAction(key: string): IAction {
    return {
        data: key,
        type: TOGGLE_LOCAL_OPTION,
    };
}

export function updateLocalOptionAction(key: string, newValue: string): IAction {
    return {
        data: {
            key,
            newValue,
        },
        type: UPDATE_LOCAL_OPTION,
    };
}

export function setMessageAction(message: IMessage): IAction {
    return {
        data: message,
        type: SET_MESSAGE,
    };
}

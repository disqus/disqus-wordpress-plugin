import AdminOptions, { IAdminOptions } from './reducers/AdminOptions';
import { IDisqusWordpressWindow } from './reducers/AdminState';

const WIN = window as IDisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP.rest;

export interface IRestResponse<T> {
    code: string;
    data: T;
    message: string;
}

const makeApiRequest = (method: string, url: string, data: any, onLoad: EventListenerOrEventListenerObject) => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, url);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.setRequestHeader('X-WP-Nonce', REST_OPTIONS.nonce);
    XHR.addEventListener('load', onLoad);
    XHR.send(data);
};

const handleResponse = (text: string, callback: (response: IRestResponse<IAdminOptions>) => void) => {
    let jsonObject = null;
    try {
        jsonObject = JSON.parse(text);
    } catch (error) {
        // Continue
    }

    callback.call(null, jsonObject);
};

export function restGet(path: string, onLoad: (response: IRestResponse<IAdminOptions>) => void) {
    makeApiRequest('GET', `${REST_OPTIONS.base}${path}`, null, (xhr: Event) => {
        handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
    });
}

export function restPost(path: string, data: any, onLoad: (response: IRestResponse<IAdminOptions>) => void) {
    makeApiRequest('POST', `${REST_OPTIONS.base}${path}`, JSON.stringify(data), (xhr: Event) => {
        handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
    });
}

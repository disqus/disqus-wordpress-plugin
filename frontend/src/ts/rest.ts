import { DisqusWordpressWindow } from './plugin';

const WIN = window as DisqusWordpressWindow;
const REST_OPTIONS = WIN.DISQUS_WP.rest;

export interface RestResponse<T> {
    code: string,
    data: T,
    message: string,
}

const makeApiRequest = function (method: string, url: string, data: any, onLoad: EventListenerOrEventListenerObject) {
    const XHR = new XMLHttpRequest();
    XHR.open(method, url);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.setRequestHeader('X-WP-Nonce', REST_OPTIONS.nonce);
    XHR.addEventListener('load', onLoad);
    XHR.send(data);
};

const handleResponse = (text: string, callback: Function) => {
    let jsonObject = null;
    try {
        jsonObject = JSON.parse(text);
    } catch (error) {
        // Continue
    }

    callback.call(null, jsonObject);
};

export function restGet(path: string, onLoad: Function) {
    makeApiRequest('GET', `${REST_OPTIONS.base}${path}`, null, (xhr: Event) => {
        handleResponse((<XMLHttpRequest>xhr.target).responseText, onLoad);
    });
};

export function restPut(path: string, data: any, onLoad: Function) {
    makeApiRequest('PUT', `${REST_OPTIONS.base}${path}`, JSON.stringify(data), (xhr: Event) => {
        handleResponse((<XMLHttpRequest>xhr.target).responseText, onLoad);
    });
};

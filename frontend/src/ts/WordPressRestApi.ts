import AdminOptions, { IAdminOptions } from './reducers/AdminOptions';
import { IDisqusWordpressWindow } from './reducers/AdminState';
import REST_OPTIONS from './REST_OPTIONS';

export interface IRestResponse<T> {
    code: string;
    data: T;
    message: string;
}

export class WordPressRestApi {
    static get instance() {
        return wordPressRestApi;
    }

    public pluginRestGet(path: string, onLoad: (response: IRestResponse<any>) => void): XMLHttpRequest {
        return this.makeApiRequest(
            'GET',
            `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}${path}`,
            null,
            (xhr: Event) => {
                this.handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
            },
        );
    }

    public pluginRestPost(
        path: string,
        data: any,
        onLoad: (response: IRestResponse<any>) => void,
    ): XMLHttpRequest {
        return this.makeApiRequest(
            'POST',
            `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}${path}`,
            data && JSON.stringify(data),
            (xhr: Event) => {
                this.handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
            });
    }

    public wordpressRestGet(path: string, query: string, onLoad: (response: any) => void) {
        return this.makeApiRequest(
            'GET',
            `${REST_OPTIONS.base}wp/v2/${path}${REST_OPTIONS.base.indexOf('?') > -1 ? '&' : '?'}${query || ''}`,
            null, (xhr: Event) => {
            this.handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
        });
    }

    private makeApiRequest(
        method: string,
        url: string,
        data: any,
        onLoad: EventListenerOrEventListenerObject,
    ): XMLHttpRequest {
        const XHR = new XMLHttpRequest();
        XHR.open(method, url);
        XHR.setRequestHeader('Content-type', 'application/json');
        XHR.setRequestHeader('X-WP-Nonce', REST_OPTIONS.nonce);
        XHR.addEventListener('load', onLoad);
        XHR.send(data);

        return XHR;
    }

    private handleResponse(text: string, callback: (response: IRestResponse<any>) => void) {
        let jsonObject = null;
        try {
            jsonObject = JSON.parse(text);
        } catch (error) {
            // Continue
        }

        callback.call(null, jsonObject);
    }
}

const wordPressRestApi: WordPressRestApi = new WordPressRestApi();

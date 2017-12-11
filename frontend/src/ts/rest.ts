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

const handleResponse = (text: string, callback: (response: IRestResponse<any>) => void) => {
    let jsonObject = null;
    try {
        jsonObject = JSON.parse(text);
    } catch (error) {
        // Continue
    }

    callback.call(null, jsonObject);
};

export function wordpressRestGet(path: string, query: string, onLoad: (response: any) => void) {
    makeApiRequest(
        'GET',
        `${REST_OPTIONS.base}wp/v2/${path}${REST_OPTIONS.base.indexOf('?') > -1 ? '&' : '?'}${query || ''}`,
        null, (xhr: Event) => {
        handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
    });
}

export function pluginRestGet(path: string, onLoad: (response: IRestResponse<any>) => void) {
    makeApiRequest('GET', `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}${path}`, null, (xhr: Event) => {
        handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
    });
}

export function pluginRestPost(path: string, data: any, onLoad: (response: IRestResponse<any>) => void) {
    makeApiRequest(
        'POST',
        `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}${path}`,
        data && JSON.stringify(data),
        (xhr: Event) => {
            handleResponse((xhr.target as XMLHttpRequest).responseText, onLoad);
        });
}

export class DisqusApi {
    static get instance() {
        return disqusApi;
    }

    private apiKey: string;
    private accessToken: string;
    private forum: string;

    public configure(apiKey: string, accessToken: string, forum: string) {
        this.apiKey = apiKey;
        this.accessToken = accessToken;
        this.forum = forum;
    }

    public createImport(xmlContent: string, filename: string, onLoad: EventListenerOrEventListenerObject): void {
        const formData: FormData = new FormData();
        formData.append('upload', new Blob([xmlContent], { type: 'text/xml' }), filename);
        formData.append('sourceType', '0');
        formData.append('forum', this.forum);
        formData.append('api_key', this.apiKey);
        formData.append('access_token', this.accessToken);

        this.post('imports/create', formData, onLoad);
    }

    public post(path: string, data: FormData, onLoad: EventListenerOrEventListenerObject): void {
        if (!this.apiKey)
            return;

        const XHR = new XMLHttpRequest();
        XHR.open('POST', `https://disqus.com/api/3.0/${path}.json`);
        XHR.addEventListener('load', onLoad);
        XHR.send(data);
    }
}

const disqusApi: DisqusApi = new DisqusApi();

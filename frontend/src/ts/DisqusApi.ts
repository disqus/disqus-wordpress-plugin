import { Moment } from "moment";

export class DisqusApi {
    static get instance() {
        return disqusApi;
    }

    // tslint:disable:variable-name
    private _apiKey: string;
    private _accessToken: string;
    private _forum: string;
    // tslint:enable:variable-name

    public get apiKey(): string {
        return this._apiKey;
    }

    public get accessToken(): string {
        return this._accessToken;
    }

    public get forum(): string {
        return this._forum;
    }

    public configure(apiKey: string, accessToken: string, forum: string) {
        this._apiKey = apiKey;
        this._accessToken = accessToken;
        this._forum = forum;
    }

    public createImport(
        xmlContent: string,
        filename: string,
        onLoad: EventListenerOrEventListenerObject,
    ): XMLHttpRequest {
        const formData: FormData = new FormData();
        formData.append('upload', new Blob([xmlContent], { type: 'text/xml' }), filename);
        formData.append('sourceType', '0');
        formData.append('forum', this.forum);

        return this.post('imports/create', formData, onLoad);
    }

    public listPostsForForum(
        cursor: string,
        startDate: Moment,
        endDate: Moment,
        limit: number,
        onLoad: EventListenerOrEventListenerObject,
    ): XMLHttpRequest {
        const query: string = [
            `start=${startDate.toISOString()}`,
            `end=${endDate.toISOString()}`,
            `forum=${this.forum}`,
            'related=thread',
            'order=asc',
            `limit=${Math.min(Math.max(limit, 1), 100)}`,
            `cursor=${cursor || ''}`,
        ].join('&');

        return this.get('posts/list', query, onLoad);
    }

    public listPostDetails(
        postID: number,
        onLoad: EventListenerOrEventListenerObject,
    ): XMLHttpRequest {
        const query: string = `post=${postID}`
        return this.get('posts/details', query, onLoad);
    }

    private get(path: string, query: string, onLoad: EventListenerOrEventListenerObject): XMLHttpRequest {
        if (!this.apiKey)
            return null;

        const XHR = new XMLHttpRequest();
        XHR.open(
            'GET',
            `https://disqus.com/api/3.0/${path}.json?api_key=${this.apiKey}&access_token=${this.accessToken}&${query}`,
        );
        XHR.addEventListener('load', onLoad);
        XHR.send();

        return XHR;
    }

    private post(path: string, data: FormData, onLoad: EventListenerOrEventListenerObject): XMLHttpRequest {
        if (!this.apiKey)
            return null;

        data.append('api_key', this.apiKey);
        data.append('access_token', this.accessToken);

        const XHR = new XMLHttpRequest();
        XHR.open('POST', `https://disqus.com/api/3.0/${path}.json`);
        XHR.addEventListener('load', onLoad);
        XHR.send(data);

        return XHR;
    }
}

const disqusApi: DisqusApi = new DisqusApi();

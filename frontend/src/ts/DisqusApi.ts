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
        formData.append('api_key', this.apiKey);
        formData.append('access_token', this.accessToken);

        return this.post('imports/create', formData, onLoad);
    }

    private post(path: string, data: FormData, onLoad: EventListenerOrEventListenerObject): XMLHttpRequest {
        if (!this.apiKey)
            return null;

        const XHR = new XMLHttpRequest();
        XHR.open('POST', `https://disqus.com/api/3.0/${path}.json`);
        XHR.addEventListener('load', onLoad);
        XHR.send(data);

        return XHR;
    }
}

const disqusApi: DisqusApi = new DisqusApi();

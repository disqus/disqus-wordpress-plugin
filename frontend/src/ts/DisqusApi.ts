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

    public post(path: string, data: FormData, onLoad: EventListenerOrEventListenerObject): XMLHttpRequest {
        if (!this.apiKey)
            return;

        const XHR = new XMLHttpRequest();
        XHR.open('POST', `https://disqus.com/api/3.0/${path}.json`);
        XHR.addEventListener('load', onLoad);
        XHR.send(data);

        return XHR;
    }
}

const disqusApi: DisqusApi = new DisqusApi();

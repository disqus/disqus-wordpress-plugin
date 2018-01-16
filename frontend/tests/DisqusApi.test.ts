import { DisqusApi } from '../src/ts/DisqusApi';

describe('DisqusApi', () => {
    let xmlHttpReq: jest.MockInstance<any>;
    let lastSentFormData: FormData;

    beforeEach(() => {
        // tslint:disable-next-line:no-string-literal
        xmlHttpReq = global['XMLHttpRequest'] = jest.fn(() => ({
            addEventListener: jest.fn(),
            open: jest.fn(),
            send: jest.fn((data: FormData) => {
                lastSentFormData = data;
            }),
        }));
    });

    test('Can be configured with authentication and forum', () => {
        const api: DisqusApi = new DisqusApi();
        api.configure('foo', 'bar', 'baz');

        expect(api.apiKey).toBe('foo');
        expect(api.accessToken).toBe('bar');
        expect(api.forum).toBe('baz');
    });

    test('Can create an import with the proper XHR request', () => {
        const onLoad = jest.fn();
        const api: DisqusApi = new DisqusApi();
        api.configure('foo', 'bar', 'baz');

        const xml: string = '<rss />';
        const filename: string = 'example.wxr';
        const xhr: XMLHttpRequest = api.createImport(xml, filename, onLoad);
        const expectedUpload: File = new File([xml], filename, {
            type: 'text/xml',
        });

        expect(xmlHttpReq.mock.instances).toHaveLength(1);
        expect(xhr.open).toBeCalledWith('POST', 'https://disqus.com/api/3.0/imports/create.json');
        expect(xhr.addEventListener).toBeCalledWith('load', onLoad);

        const uploadFile: File = lastSentFormData.get('upload') as File;
        expect(uploadFile.name).toBe(expectedUpload.name);
        expect(uploadFile.type).toBe(expectedUpload.type);
        expect(uploadFile.size).toBe(expectedUpload.size);

        expect(lastSentFormData.get('sourceType')).toBe('0');
        expect(lastSentFormData.get('forum')).toBe('baz');
        expect(lastSentFormData.get('api_key')).toBe('foo');
        expect(lastSentFormData.get('access_token')).toBe('bar');
    });
});

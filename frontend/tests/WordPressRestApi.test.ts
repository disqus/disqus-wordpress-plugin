import REST_OPTIONS from '../src/ts/REST_OPTIONS';
import { WordPressRestApi } from '../src/ts/WordPressRestApi';

describe('WordPressRestApi', () => {
    let xmlHttpReq: jest.MockInstance<any>;
    let lastSentFormData: FormData;
    let lastEventListener: jest.EmptyFunction;

    beforeEach(() => {
        xmlHttpReq = global.XMLHttpRequest = jest.fn(() => ({
            addEventListener: jest.fn((event: string, onload: jest.EmptyFunction) => {
                if (event === 'load')
                    lastEventListener = onload;
            }),
            open: jest.fn(),
            send: jest.fn((data: FormData) => {
                lastSentFormData = data;
                if (lastEventListener) {
                    lastEventListener.call(this, {
                        target: {
                            responseText: JSON.stringify({ foo: 'bar' }),
                        },
                    });
                }
            }),
            setRequestHeader: jest.fn(),
        }));
    });

    afterEach(() => {
        xmlHttpReq = null;
        lastSentFormData = null;
        lastEventListener = null;
    });

    test('Static instance is defined', () => {
        expect(WordPressRestApi.instance).toBeInstanceOf(WordPressRestApi);
    });

    test('Can make a GET request to the plugin REST API', () => {
        const wordPressRestApi: WordPressRestApi = new WordPressRestApi();
        const onLoad = jest.fn();

        const request = wordPressRestApi.pluginRestGet('settings', onLoad);

        expect(request.open).toHaveBeenCalledWith('GET', `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}settings`);
        expect(request.setRequestHeader).toHaveBeenCalledWith('X-WP-Nonce', REST_OPTIONS.nonce);
        expect(request.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json');
        expect(request.addEventListener).toHaveBeenCalledTimes(1);
        expect(request.send).toHaveBeenCalledWith(null);
        expect(onLoad).toHaveBeenCalled();
    });

    test('Can make a POST request to the plugin REST API', () => {
        const wordPressRestApi: WordPressRestApi = new WordPressRestApi();
        const onLoad = jest.fn();
        const postData = { foo: 'bar' };
        const request = wordPressRestApi.pluginRestPost('settings', postData, onLoad);

        expect(request.open).toHaveBeenCalledWith('POST', `${REST_OPTIONS.base}${REST_OPTIONS.disqusBase}settings`);
        expect(request.setRequestHeader).toHaveBeenCalledWith('X-WP-Nonce', REST_OPTIONS.nonce);
        expect(request.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json');
        expect(request.addEventListener).toHaveBeenCalledTimes(1);
        expect(request.send).toHaveBeenCalledWith(JSON.stringify(postData));
        expect(onLoad).toHaveBeenCalled();
    });

    test('Can make a GET request to the WordPress REST API', () => {
        const wordPressRestApi: WordPressRestApi = new WordPressRestApi();
        const onLoad = jest.fn();

        const request = wordPressRestApi.wordpressRestGet('comments', 'foo=bar', onLoad);

        expect(request.open).toHaveBeenCalledWith('GET', `${REST_OPTIONS.base}wp/v2/comments?foo=bar`);
        expect(request.setRequestHeader).toHaveBeenCalledWith('X-WP-Nonce', REST_OPTIONS.nonce);
        expect(request.setRequestHeader).toHaveBeenCalledWith('Content-type', 'application/json');
        expect(request.addEventListener).toHaveBeenCalledTimes(1);
        expect(request.send).toHaveBeenCalledWith(null);
        expect(onLoad).toHaveBeenCalled();
    });
});

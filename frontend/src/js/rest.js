const REST_OPTIONS = window.DISQUS_WP.rest;

const makeApiRequest = function (method, url, data, onLoad) {
    const XHR = new window.XMLHttpRequest();
    XHR.open(method, url);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.setRequestHeader('X-WP-Nonce', REST_OPTIONS.nonce);
    XHR.addEventListener('load', onLoad);
    XHR.send(data);
};

const handleResponse = (text, callback) => {
    let jsonObject = null;
    try {
        jsonObject = JSON.parse(text);
    } catch (error) {
        // Continue
    }

    callback.call(null, jsonObject);
};

export function restGet(path, onLoad) {
    makeApiRequest('GET', `${REST_OPTIONS.base}${path}`, null, xhr => {
        handleResponse(xhr.target.responseText, onLoad);
    });
};

export function restPut(path, data, onLoad) {
    makeApiRequest('PUT', `${REST_OPTIONS.base}${path}`, JSON.stringify(data), xhr => {
        handleResponse(xhr.target.responseText, onLoad);
    });
};

import { IDisqusWordpressWindow } from './reducers/AdminState';

export function getWordpressAdminUrl(name: string): string {
    return (window as IDisqusWordpressWindow).DISQUS_WP.adminUrls[name];
}

export function getForumAdminUrl(shortname: string, path: string): string {
    return `https://${shortname}.disqus.com/admin/${path}/`;
}

export function createRandomToken(length: number = 32): string {
    let token = '';
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++)
      token += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

    return token;
}

import { IDisqusWordpressWindow } from './reducers/AdminState';

export function getWordpressAdminUrl(name: string): string {
    return (window as IDisqusWordpressWindow).DISQUS_WP.adminUrls[name];
}

export function getForumAdminUrl(shortname: string, path: string): string {
    return `https://${shortname}.disqus.com/admin/${path}/`;
}

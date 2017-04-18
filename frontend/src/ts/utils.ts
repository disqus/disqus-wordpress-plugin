import { DisqusWordpressWindow } from './plugin';

export function getWordpressAdminUrl(name: string) {
    return (<DisqusWordpressWindow>window).DISQUS_WP.adminUrls[name];
}

export function getForumAdminUrl(shortname: string, path: string) {
    return `https://${shortname}.disqus.com/admin/${path}/`;
}

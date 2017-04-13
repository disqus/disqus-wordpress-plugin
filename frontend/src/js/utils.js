export function getWordpressAdminUrl(name) {
    return window.DISQUS_WP.adminUrls[name];
}

export function getForumAdminUrl(shortname, path) {
    return `https://${shortname}.disqus.com/admin/${path}/`;
}

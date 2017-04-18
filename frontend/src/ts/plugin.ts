export interface RestOptions {
    base: string,
    nonce: string,
}

export interface AdminPermissions {
    canManageSettings: boolean,
}

export interface AdminUrls {
    disqus: string,
    editComments: string,
    [key: string]: string,
}

export interface SiteConfig {
    name: string,
}

export interface DisqusWPOptions {
    permissions: AdminPermissions,
    rest: RestOptions,
    adminUrls: AdminUrls,
    site: SiteConfig,
}

export interface DisqusWordpressWindow extends Window {
    DISQUS_WP: DisqusWPOptions,
}

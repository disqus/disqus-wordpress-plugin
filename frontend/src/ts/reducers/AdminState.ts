export interface IMessage {
    text: string;
    type: string;
}

export interface IRestOptions {
    base: string;
    nonce: string;
}

export interface IAdminPermissions {
    canManageSettings: boolean;
}

export interface IAdminUrls {
    disqus: string;
    editComments: string;
    [key: string]: string;
}

export interface IWordpressSite {
    name: string;
}

export interface IAdminOptions {
    disqus_forum_url?: string;
    disqus_public_key?: string;
    disqus_secret_key?: string;
    disqus_admin_access_token?: string;
    disqus_sso_button?: string;
    disqus_sso_enabled?: boolean;
    disqus_manual_sync?: boolean;
    disqus_sync_token?: string;
    [key: string]: any;
}

export interface IAdminConfigData {
    permissions: IAdminPermissions;
    rest: IRestOptions;
    adminUrls: IAdminUrls;
    site: IWordpressSite;
}

export interface IDisqusWordpressWindow extends Window {
    DISQUS_WP: IAdminConfigData;
}

export interface IAdminState {
    config: IAdminConfigData;
    adminOptions: IAdminOptions;
    localAdminOptions: IAdminOptions;
    message: IMessage;
    isSiteFormLocked: boolean;
    [key: string]: any;
}

export default class AdminState implements IAdminState {
    public config: IAdminConfigData;
    public adminOptions: IAdminOptions;
    public localAdminOptions: IAdminOptions;
    public message: IMessage;
    public isSiteFormLocked: boolean;

    constructor(config: IAdminConfigData) {
        this.config = config;
        this.isSiteFormLocked = true;
    }
}

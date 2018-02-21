import { Record } from 'immutable';

export interface IAdminOptions {
    disqus_forum_url?: string;
    disqus_public_key?: string;
    disqus_secret_key?: string;
    disqus_admin_access_token?: string;
    disqus_installed?: boolean;
    disqus_sso_button?: string;
    disqus_sso_enabled?: boolean;
    disqus_sync_token?: string;
    disqus_render_js?: boolean;
}

export default class AdminOptions extends Record({
    disqus_admin_access_token: null,
    disqus_forum_url: null,
    disqus_installed: null,
    disqus_public_key: null,
    disqus_render_js: null,
    disqus_secret_key: null,
    disqus_sso_button: null,
    disqus_sso_enabled: null,
    disqus_sync_token: null,
}) implements IAdminOptions {
    /* tslint:disable:variable-name */
    public disqus_forum_url?: string;
    public disqus_public_key?: string;
    public disqus_secret_key?: string;
    public disqus_admin_access_token?: string;
    public disqus_installed?: boolean;
    public disqus_render_js?: boolean;
    public disqus_sso_button?: string;
    public disqus_sso_enabled?: boolean;
    public disqus_sync_token?: string;
    /* tslint:enable:variable-name */

    public constructor(options?: IAdminOptions) {
        super(options);
    }

    public set(key: string, value: any): AdminOptions {
        return super.set(key, value) as this;
    }

    public with(values: IAdminOptions): AdminOptions {
        return this.merge(values) as this;
    }
}

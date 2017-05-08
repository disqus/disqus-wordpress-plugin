import { Record } from 'immutable';

export interface IAdminOptions {
    disqus_forum_url?: string;
    disqus_public_key?: string;
    disqus_secret_key?: string;
    disqus_admin_access_token?: string;
    disqus_installed?: boolean;
    disqus_sso_button?: string;
    disqus_sso_enabled?: boolean;
    disqus_manual_sync?: boolean;
    disqus_sync_token?: string;
    disqus_sync_activated?: boolean;
}

export default class AdminOptions extends Record({
    disqus_admin_access_token: null,
    disqus_forum_url: null,
    disqus_installed: null,
    disqus_manual_sync: null,
    disqus_public_key: null,
    disqus_secret_key: null,
    disqus_sso_button: null,
    disqus_sso_enabled: null,
    disqus_sync_activated: null,
    disqus_sync_token: null,
}) implements IAdminOptions {
    /* tslint:disable:variable-name */
    public disqus_forum_url?: string;
    public disqus_public_key?: string;
    public disqus_secret_key?: string;
    public disqus_admin_access_token?: string;
    public disqus_installed?: boolean;
    public disqus_sso_button?: string;
    public disqus_sso_enabled?: boolean;
    public disqus_manual_sync?: boolean;
    public disqus_sync_activated?: boolean;
    public disqus_sync_token?: string;
    /* tslint:enable:variable-name */

    public constructor(options?: IAdminOptions) {
        super(options);
    }

    public with(values: IAdminOptions) {
        return this.merge(values) as this;
    }
}

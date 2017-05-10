import { Record } from 'immutable';
import AdminOptions, { IAdminOptions } from './AdminOptions';

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
    adminOptions?: IAdminOptions;
    config?: IAdminConfigData;
    isBusy?: boolean;
    isSiteFormLocked?: boolean;
    localAdminOptions?: IAdminOptions;
    message?: IMessage;
    [key: string]: any;
}

export default class AdminState extends Record({
    adminOptions: null,
    config: null,
    isBusy: false,
    isSiteFormLocked: true,
    localAdminOptions: null,
    message: null,
}) implements IAdminState {
    public adminOptions: AdminOptions;
    public config: IAdminConfigData;
    public isBusy: boolean;
    public isSiteFormLocked: boolean;
    public localAdminOptions: AdminOptions;
    public message: IMessage;

    constructor(config: IAdminConfigData) {
        super({
            config,
            adminOptions: new AdminOptions(),
            localAdminOptions: new AdminOptions(),
        });
    }

    public set(key: string, value: any): AdminState {
        return super.set(key, value) as this;
    }

    public with(values: IAdminState): AdminState {
        return this.merge(values) as this;
    }
}

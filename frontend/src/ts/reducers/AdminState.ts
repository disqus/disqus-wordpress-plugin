import { Map, Record } from 'immutable';
import AdminOptions, { IAdminOptions } from './AdminOptions';
import SyncStatus, { ISyncStatus } from './SyncStatus';

export interface IMessage {
    text: string;
    type: string;
    onDismiss?: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

export interface IRestOptions {
    base: string;
    disqusBase: string;
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
    pluginVersion: string;
    allPlugins: any;
    phpVersion: string;
    wordpressVersion: string;
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
    installationState?: InstallationState;
    isFetchingAdminOptions?: boolean;
    isFetchingSyncStatus?: boolean;
    isSiteFormLocked?: boolean;
    localAdminOptions?: IAdminOptions;
    message?: IMessage;
    [key: string]: any;
}

export interface IExportPostLog {
    id: number;
    title: string;
    link: string;
    status: ExportLogStaus;
    numComments?: number;
    error?: string;
}

export enum InstallationState {
    none,
    noAccount,
    hasAccount,
    noSite,
    hasSite,
    installed,
}

export enum ExportLogStaus {
    pending,
    complete,
    failed,
}

export default class AdminState extends Record({
    activeTab: null,
    adminOptions: null,
    config: null,
    exportLogs: null,
    installationState: InstallationState.none,
    isExportRunning: false,
    isFetchingAdminOptions: false,
    isFetchingSyncStatus: false,
    isSiteFormLocked: true,
    localAdminOptions: null,
    message: null,
    syncStatus: null,
}) implements IAdminState {
    public activeTab: string;
    public adminOptions: AdminOptions;
    public config: IAdminConfigData;
    public exportLogs: Map<number, IExportPostLog>;
    public installationState: InstallationState;
    public isExportRunning: boolean;
    public isFetchingAdminOptions: boolean;
    public isFetchingSyncStatus: boolean;
    public isSiteFormLocked: boolean;
    public localAdminOptions: AdminOptions;
    public message: IMessage;
    public syncStatus: SyncStatus;

    constructor(config: IAdminConfigData) {
        super({
            adminOptions: new AdminOptions(),
            config,
            exportLogs: Map(),
            localAdminOptions: new AdminOptions(),
            syncStatus: new SyncStatus(),
        });
    }

    public set(key: string, value: any): AdminState {
        return super.set(key, value) as this;
    }

    public with(values: IAdminState): AdminState {
        return this.merge(values) as this;
    }
}

import { Record } from 'immutable';

export interface ISyncStatus {
    enabled?: boolean;
    last_message?: string;
    requires_update?: any;
    subscribed?: boolean;
    subscription?: any;
}

export default class SyncStatus extends Record({
    enabled: null,
    last_message: null,
    requires_update: null,
    subscribed: null,
    subscription: null,
}) implements ISyncStatus {
    /* tslint:disable:variable-name */
    public enabled?: boolean;
    public last_message?: string;
    public requires_update?: any;
    public subscribed?: boolean;
    public subscription?: any;
    /* tslint:enable:variable-name */

    public constructor(options?: ISyncStatus) {
        super(options);
    }

    public set(key: string, value: any): SyncStatus {
        return super.set(key, value) as this;
    }

    public with(values: ISyncStatus): SyncStatus {
        return this.merge(values) as this;
    }
}

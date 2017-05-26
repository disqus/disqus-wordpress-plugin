import * as React from 'react';
import SyncStatus from '../reducers/SyncStatus';
import { IFormProps } from './FormProps';

const getSyncStatus = (syncStatus: SyncStatus) => {
    if (!syncStatus.subscribed)
        return __('Not Configured');

    return syncStatus.enabled ? __('Running') : __('Paused');
};

const SyncConfigForm = (props: IFormProps) => (
    <form
        name={props.data.syncStatus.enabled ? 'sync/disable' : 'sync/enable'}
        method="POST"
        onSubmit={props.onSubmitSyncConfigForm}
    >
        <p>
            <span className="dashicons dashicons-update" />
            {' '}
            {__('Auto syncing')}{':'}
            {' '}
            <strong>{getSyncStatus(props.data.syncStatus)}</strong>
        </p>
        {props.data.syncStatus.last_message ? <p>{props.data.syncStatus.last_message}</p> : null}
        <p className="submit">
            <button type="submit" className="button button-large">
                <span className={`dashicons dashicons-controls-${props.data.syncStatus.enabled ? 'pause' : 'play'}`} />
                {' '}
                {props.data.syncStatus.enabled ? __('Pause Auto Syncing') : __('Enable Auto Syncing')}
            </button>
        </p>
    </form>
);

export default SyncConfigForm;

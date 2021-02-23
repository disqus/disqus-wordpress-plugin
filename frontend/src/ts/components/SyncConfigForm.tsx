import * as React from 'react';
import SyncStatus from '../reducers/SyncStatus';
import { IFormProps } from './FormProps';

const getSyncStatus = (syncStatus: SyncStatus) => {
    if (!syncStatus.subscribed) {
        return {
            button: __('Enable Auto Syncing'),
            endpoint: 'sync/enable',
            status: __('Not Configured'),
            statusIcon: 'play',
        };
    }

    if (syncStatus.requires_update) {
        return {
            button: __('Update Auto Syncing'),
            endpoint: 'sync/enable',
            status: __('Needs Update'),
            statusIcon: 'play',
        };
    }

    if (syncStatus.enabled) {
        return {
            button: __('Pause Auto Syncing'),
            endpoint: 'sync/disable',
            status: __('Running'),
            statusIcon: 'pause',
        };
    }

    return {
        button: __('Enable Auto Syncing'),
        endpoint: 'sync/enable',
        status: __('Paused'),
        statusIcon: 'play',
    };
};

const SyncConfigForm = (props: IFormProps) => {
    const syncStatus = getSyncStatus(props.data.syncStatus);
    return (
        <form
            name={syncStatus.endpoint}
            method='POST'
            onSubmit={props.onSubmitSyncConfigForm}
        >
            <p>
                <span className='dashicons dashicons-update' />
                {' '}
                {__('Auto syncing')}{':'}
                {' '}
                <strong>{syncStatus.status}</strong>
            </p>
            {!props.data.syncStatus.is_manual && props.data.syncStatus.last_message ?
                <p>{props.data.syncStatus.last_message}</p>
            : null}
            <p className='submit'>
                <button type='submit' className='button button-large'>
                    <span className={`dashicons dashicons-controls-${syncStatus.statusIcon}`} />
                    {' '}
                    {syncStatus.button}
                </button>
            </p>
            {props.data.isManualSyncFormVisible ? null : (
                <p>
                    <button
                        type='button'
                        className='button button-link'
                        onClick={props.onToggleState.bind(null, 'isManualSyncFormVisible')}
                    >
                        {__('Manually Sync Comments')}
                    </button>
                </p>
            )}
        </form>
    );
};

export default SyncConfigForm;

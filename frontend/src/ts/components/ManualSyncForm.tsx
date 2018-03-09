import * as moment from 'moment';
import * as React from 'react';
import SyncStatus from '../reducers/SyncStatus';
import { IFormProps } from './FormProps';

const ManualSyncForm = (props: IFormProps) => {
    return (
        <form
            name='manual-sync'
            method='POST'
            onSubmit={props.onSubmitManualSyncForm}
        >
            <h4>{__('Manually Sync Comments')}</h4>
            <p className='description'>
                {__('Select a time range to sync past comments. Date ranges are limited to a maximum of 12 months.')}
            </p>
            <table className='form-table'>
                <tbody>
                    <tr>
                        <th scope='row'>
                            <label htmlFor='manualSyncRangeStart'>
                                {__('Start Date')}
                            </label>
                        </th>
                        <td>
                            <input
                                type='date'
                                id='manualSyncRangeStart'
                                name='manualSyncRangeStart'
                                className='regular-text'
                                value={props.data.manualSyncRangeStart}
                                onChange={props.onDateSelectorInputchange.bind(null, 'manualSyncRangeStart')}
                                max={props.data.manualSyncRangeEnd}
                                min={moment(props.data.manualSyncRangeEnd).subtract(12, 'months').format('YYYY-MM-DD')}
                                disabled={props.data.isManualSyncRunning}
                            />
                            <p className='description'>
                                {__('The start date for the manual sync')}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope='row'>
                            <label htmlFor='manualSyncRangeEnd'>
                                {__('End Date')}
                            </label>
                        </th>
                        <td>
                            <input
                                type='date'
                                id='manualSyncRangeEnd'
                                name='manualSyncRangeEnd'
                                className='regular-text'
                                value={props.data.manualSyncRangeEnd}
                                onChange={props.onDateSelectorInputchange.bind(null, 'manualSyncRangeEnd')}
                                max={moment().format('YYYY-MM-DD')}
                                min={props.data.manualSyncRangeStart}
                                disabled={props.data.isManualSyncRunning}
                            />
                            <p className='description'>
                                {__('The end date for the manual sync')}
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className='submit'>
                <button type='submit' className='button button-large' disabled={props.data.isManualSyncRunning}>
                    <span className='dashicons dashicons-update' />
                    {' '}
                    {__('Run Manual Sync')}
                </button>
            </p>
        </form>
    );
};

export default ManualSyncForm;

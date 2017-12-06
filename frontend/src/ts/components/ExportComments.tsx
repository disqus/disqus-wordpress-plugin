import * as React from 'react';
import { ExportLogStaus, IExportPostLog } from '../reducers/AdminState';
import { IFormProps } from './FormProps';

const LogMessages = (props: IFormProps) => {
    const logArray: IExportPostLog[] = props.data.exportLogs.toArray();
    const logElements: JSX.Element[] = logArray.map((log: IExportPostLog) => {
        let statusColor: string;
        let statusText: JSX.Element|string;
        switch (log.status) {
        case ExportLogStaus.failed:
            statusColor = 'red';
            statusText = <abbr title={log.error}>{__('Failed')}</abbr>;
            break;
        case ExportLogStaus.complete:
            statusColor = 'green';
            statusText = __('Complete');
            break;
        case ExportLogStaus.pending:
        default:
            statusColor = 'gray';
            statusText = __('Pending');
            break;
        }

        return (
            <tr key={log.id}>
                <td>{log.id}</td>
                <td><a href={log.link}>{log.title}</a></td>
                <td><strong style={{ color: statusColor }}>{statusText}</strong></td>
                <td>{log.numComments}</td>
            </tr>
        );
    });

    return (
        <div>
            <h4>{props.data.isExportRunning ? __('Exporting') + '…' : 'Done'}</h4>
            <table className='wp-list-table widefat striped'>
                <thead>
                    <tr>
                        <th scope='col'>{__('ID')}</th>
                        <th scope='col'>{__('Title')}</th>
                        <th scope='col'>{__('Status')}</th>
                        <th scope='col'>{__('# Imported')}</th>
                    </tr>
                </thead>
                <tbody>
                    {logElements}
                </tbody>
            </table>
        </div>
    );
};

const ExportComments = (props: IFormProps) => (
    <form
        name='export'
        method='POST'
        onSubmit={props.onSubmitExportCommentsForm}
    >
        <p className='submit'>
            <button type='submit' className='button button-large' disabled={props.data.isExportRunning}>
                <span className='dashicons dashicons-upload' />
                {' '}
                {__('Export Comments')}
            </button>
        </p>
        {props.data.exportLogs.size ? <LogMessages {...props} /> : null}
    </form>
);

export default ExportComments;

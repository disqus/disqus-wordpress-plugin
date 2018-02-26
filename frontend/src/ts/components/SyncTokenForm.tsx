import * as React from 'react';
import SyncStatus from '../reducers/SyncStatus';
import { IFormProps } from './FormProps';

const SyncTokenForm = (props: IFormProps) => {
    return (
        <form name='site' action='' method='POST' onSubmit={props.onSubmitSiteForm} autoComplete='off'>
            <table className='form-table'>
                <tbody>
                    <tr>
                        <th scope='row'>
                            <label htmlFor='disqus_sync_token'>
                                {__('Site Secret Key')}
                            </label>
                        </th>
                        <td>
                            <input
                                type='text'
                                id='disqus_sync_token'
                                name='disqus_sync_token'
                                className='regular-text'
                                value={props.data.localAdminOptions.get('disqus_sync_token') || ''}
                                onChange={props.onInputChange.bind(null, 'disqus_sync_token')}
                            />
                            <p className='description'>
                                {__('Enter any combination of letters and numbers, at least 32 characters.')}
                                <br />
                                <a href='#' onClick={props.onGenerateRandomSyncToken}>{__('Generate a key')}</a>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className='submit'>
                <input
                    type='submit'
                    name='submit-site-form'
                    className='button button-primary'
                    value={__('Save')}
                />
            </p>
        </form>
    );
};

export default SyncTokenForm;

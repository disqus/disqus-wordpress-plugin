import * as React from 'react';
import { IFormProps } from './FormProps';

const SyncConfigForm = (props: IFormProps) => (
    <form name="sync" action="" method="POST" onSubmit={props.onSubmit}>
        <table className="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="disqus_manual_sync">
                            {__('Disable Automatic Syncing')}
                        </label>
                    </th>
                    <td>
                        <input
                            type="checkbox"
                            id="disqus_manual_sync"
                            name="disqus_manual_sync"
                            checked={Boolean(props.data.localAdminOptions.get('disqus_manual_sync'))}
                            onChange={props.onInputChange.bind(null, 'disqus_manual_sync')}
                        />
                        <p className="description">
                            {'Enabling this will stop comments from being saved to your local WordPress database.'}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p className="submit">
            <input
                type="submit"
                name="submit-application-form"
                className="button button-primary"
                value={__('Save')}
            />
        </p>
    </form>
);

export default SyncConfigForm;

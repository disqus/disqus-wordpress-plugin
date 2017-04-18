import * as React from 'react';
import { FormProps } from './FormProps';

const SyncConfigForm = (props: FormProps) => (
    <form name="sync" action="" method="POST" onSubmit={props.onSubmit}>
        <table className="form-table">
            <tbody>
                <tr>
                    <th scope="row">
                        <label htmlFor="localManualSync">
                            {__('Disable Automatic Syncing')}
                        </label>
                    </th>
                    <td>
                        <input
                            type="checkbox"
                            id="localManualSync"
                            name="disqus_manual_sync"
                            checked={Boolean(props.localManualSync)}
                            onChange={props.onInputChange.bind(null, 'localManualSync')}
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

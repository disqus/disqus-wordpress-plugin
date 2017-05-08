import * as React from 'react';
import { IFormProps } from './FormProps';

const SyncEnableButton = (props: IFormProps) => (
    <form name="sync_enable" action="" method="POST" onSubmit={props.onSubmit}>
        <p className="submit">
            <input
                type="submit"
                name="submit-application-form"
                className="button button-primary button-large"
                value={__('Enable Syncing')}
            />
        </p>
    </form>
);

export default SyncEnableButton;

import * as React from 'react';
import { IFormProps } from './FormProps';

const DIAGNOSTICS_TEXTAREA_ID = 'diagnostics-textarea';

const SupportDiagnostics = (props: IFormProps) => (
    <div>
        <div>
            <textarea
                id={DIAGNOSTICS_TEXTAREA_ID}
                readOnly={true}
                style={{minWidth: '320px', minHeight: '200px'}}
                value={JSON.stringify(props, null, 4)}
            />
            <br />
            <button
                className="button"
                onClick={props.onCopyText.bind(null, DIAGNOSTICS_TEXTAREA_ID)}
            >
                {__('Copy')}
            </button>
        </div>
    </div>
);

export default SupportDiagnostics;

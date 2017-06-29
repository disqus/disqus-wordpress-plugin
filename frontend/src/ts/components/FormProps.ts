import * as React from 'react';
import AdminState from '../reducers/AdminState';

export interface IFormProps {
    data: AdminState;
    onCopyText(textValue: string): void;
    onToggleState(stateKey: string): void;
    onInputChange(stateKey: string, event: React.SyntheticEvent<HTMLInputElement>): void;
    onSubmitSiteForm(event: React.SyntheticEvent<HTMLFormElement>): void;
    onSubmitSyncConfigForm(event: React.SyntheticEvent<HTMLFormElement>): void;
}

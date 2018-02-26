import * as React from 'react';
import AdminState, { InstallationState } from '../reducers/AdminState';

export interface IFormProps {
    data: AdminState;
    onCopyText(textValue: string): void;
    onGenerateRandomSyncToken(event: React.SyntheticEvent<HTMLAnchorElement>): void;
    onToggleState(stateKey: string): void;
    onInputChange(stateKey: string, event: React.SyntheticEvent<HTMLInputElement>): void;
    onSubmitExportCommentsForm(event: React.SyntheticEvent<HTMLFormElement>): void;
    onSubmitSiteForm(event: React.SyntheticEvent<HTMLFormElement>): void;
    onSubmitSyncConfigForm(event: React.SyntheticEvent<HTMLFormElement>): void;
    onUpdateInstallationState(newState: InstallationState): void;
}

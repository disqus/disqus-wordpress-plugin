import * as React from 'react';
import { IAdminState } from '../reducers/AdminState';

export interface IFormProps {
    data: IAdminState;
    onToggleState(stateKey: string): void;
    onInputChange(stateKey: string, event: React.SyntheticEvent<HTMLInputElement>): void;
    onSubmit(event: React.SyntheticEvent<HTMLFormElement>): void;
}

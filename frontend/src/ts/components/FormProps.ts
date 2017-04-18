import * as React from 'react';
import { MainState } from './Main';

export interface FormProps extends MainState {
    onToggleState(stateKey: string): void,
    onInputChange(stateKey: string, event: React.SyntheticEvent<HTMLInputElement>): void,
    onSubmit(event: React.SyntheticEvent<HTMLFormElement>): void,
}

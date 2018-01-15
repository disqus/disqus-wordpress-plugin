import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as TestRenderer from 'react-test-renderer';
import * as Redux from 'redux';
import { IFormProps } from '../../src/ts/components/FormProps';
import SupportDiagnostics from '../../src/ts/components/SupportDiagnostics';
import adminApp from '../../src/ts/reducers/adminApp';
import AdminState, { IAdminConfigData } from '../../src/ts/reducers/AdminState';
import { DEFAULT_FORM_PROPS } from '../fixtures';

test('SupportDiagnostics renders a readonly textarea with admin config data', () => {
    const component = TestRenderer.create(<SupportDiagnostics {...DEFAULT_FORM_PROPS} />);
    const root = component.root;
    const textarea = root.findByType('textarea');

    expect(textarea.props.readOnly).toBe(true);
    expect(textarea.props.value).toBe(JSON.stringify(DEFAULT_FORM_PROPS, null, 4));
});

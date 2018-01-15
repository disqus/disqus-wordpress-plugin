import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SupportDiagnostics from '../../src/ts/components/SupportDiagnostics';
import { getDefaultFormProps } from '../fixtures';

test('SupportDiagnostics renders a readonly textarea with admin config data', () => {
    const component = TestRenderer.create(<SupportDiagnostics {...getDefaultFormProps()} />);
    const root = component.root;
    const textarea = root.findByType('textarea');

    expect(textarea.props.readOnly).toBe(true);
    expect(textarea.props.value).toBe(JSON.stringify(getDefaultFormProps(), null, 4));
});

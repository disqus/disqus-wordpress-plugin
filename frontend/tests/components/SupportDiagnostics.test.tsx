import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SupportDiagnostics from '../../src/ts/components/SupportDiagnostics';
import { DEFAULT_FORM_PROPS } from '../fixtures';

test('SupportDiagnostics renders a readonly textarea with admin config data', () => {
    const component = TestRenderer.create(<SupportDiagnostics {...DEFAULT_FORM_PROPS} />);
    const root = component.root;
    const textarea = root.findByType('textarea');

    expect(textarea.props.readOnly).toBe(true);
    expect(textarea.props.value).toBe(JSON.stringify(DEFAULT_FORM_PROPS, null, 4));
});

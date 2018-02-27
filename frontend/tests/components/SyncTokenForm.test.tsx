import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SyncTokenForm from '../../src/ts/components/SyncTokenForm';
import { getDefaultFormProps } from '../fixtures';

test('SyncTokenForm renders with correct snapshot', () => {
    const component = TestRenderer.create(<SyncTokenForm {...getDefaultFormProps()} />);

    expect(component).toMatchSnapshot();
});

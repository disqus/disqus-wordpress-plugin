import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import SupportLinks from '../../src/ts/components/SupportLinks';

test('SupportLinks renders with correct links', () => {
    const component = TestRenderer.create(<SupportLinks />);

    expect(component).toMatchSnapshot();
});

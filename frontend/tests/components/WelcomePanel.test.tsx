import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import WelcomePanel from '../../src/ts/components/WelcomePanel';

test('WelcomePanel renders basic layout', () => {
    const component = TestRenderer.create(<WelcomePanel shortname='foo' />);

    expect(component).toMatchSnapshot();
});

import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import HelpResources from '../../src/ts/components/HelpResources';

test('SupportLinks renders with correct links', () => {
    const component = TestRenderer.create(<HelpResources />);

    expect(component).toMatchSnapshot();
});

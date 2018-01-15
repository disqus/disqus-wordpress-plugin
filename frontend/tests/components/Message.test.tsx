import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import Message from '../../src/ts/components/Message';
import { IMessage } from '../../src/ts/reducers/AdminState';

describe('Message rendering', () => {
    const props: IMessage = {
        onDismiss: null,
        text: 'Test message',
        type: 'error',
    };

    test('Includes message content and class name', () => {
        const component = TestRenderer.create(<Message {...props} />);
        const root = component.root;

        expect(root.findByType('p').children).toEqual(['Test message']);
        expect(root.findByType('div').props.className).toBe('notice notice-error inline is-dismissible');
    });

    test('Dismiss button is rendered with the onDismiss prop', () => {
        const onDismiss = jest.fn();
        const component = TestRenderer.create(<Message {...props} onDismiss={onDismiss} />);
        const root = component.root;
        const dismissButton = root.findByType('button');
        dismissButton.props.onClick();

        expect(onDismiss).toHaveBeenCalled();
    });

    test('Excludes dismiss button is without the onDismiss prop', () => {
        const component = TestRenderer.create(<Message {...props} />);
        const root = component.root;

        expect(() => {
            root.findByType('button');
        }).toThrow();
    });
});

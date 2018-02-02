import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { IFormProps } from '../../src/ts/components/FormProps';
import Install from '../../src/ts/components/Install';
import { InstallationState } from '../../src/ts/reducers/AdminState';
import { getDefaultFormProps } from '../fixtures';

describe('Install component rendering', () => {
    test('InstallationState.none displays the entry form snapshot', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.none);
        const component = TestRenderer.create(<Install {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('InstallationState.hasAccount displays a followup question about registering a site', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.hasAccount);
        const component = TestRenderer.create(<Install {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('InstallationState.noAccount displays a instructions for registering an account', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.noAccount);
        const component = TestRenderer.create(<Install {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('InstallationState.hasSite displays a instructions for installing using an existing site', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.hasSite);
        const component = TestRenderer.create(<Install {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('InstallationState.noSite displays a instructions for installing using an new site', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.noSite);
        const component = TestRenderer.create(<Install {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Handles cross-site communication', () => {
        // tslint:disable:no-string-literal
        const mockLocationReload = jest.fn();
        const mockLocationObject = window.location.reload = mockLocationReload;

        const mockChildWindowPostMessage = jest.fn();
        const mockOpenFunction = window['open'] = jest.fn();

        mockOpenFunction.mockReturnValue({
            postMessage: mockChildWindowPostMessage,
        });
        let postMessageHandler;
        const mockEventListenerFunction = window['addEventListener'] = jest.fn(
            (type: string, listener: () => void, options: boolean) => {
                postMessageHandler = jest.fn(listener);
            },
        );
        // tslint:enable:no-string-literal

        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('installationState', InstallationState.hasSite);
        props.data = props.data.set('adminOptions', props.data.adminOptions.set('disqus_sync_token', 'foo'));
        const component = TestRenderer.create(<Install {...props} />);

        const openDisqusButton = component.root.findByProps({children: 'WordPress installation page'});
        openDisqusButton.props.onClick();

        // tslint:disable-next-line:max-line-length
        const expectedUrl = 'https://disqus.com/profile/login/?next=https%3A%2F%2Fdisqus.com%2Fadmin%2Finstall%2Fplatforms%2Fwordpress%2F';

        expect(mockOpenFunction).toBeCalledWith(expectedUrl);
        expect(mockEventListenerFunction).toBeCalledWith('message', expect.anything(), false);

        postMessageHandler({
            data: 'installPageReady',
            origin: 'https://foo.disqus.com/',
        });
        const expectedSyncToken = 'https://foo.com/wp-json/disqus/v1/settings foo';

        expect(mockChildWindowPostMessage).toBeCalledWith(expectedSyncToken, 'https://foo.disqus.com/');

        postMessageHandler({
            data: 'configurationUpdated',
            origin: 'https://foo.disqus.com/',
        });

        expect(mockLocationReload).toHaveBeenCalledTimes(1);

        postMessageHandler({
            data: 'configurationUpdated',
            origin: 'https://foo.com/',
        });

        expect(mockLocationReload).toHaveBeenCalledTimes(1);
    });
});
